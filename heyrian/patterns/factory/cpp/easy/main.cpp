// Complete makeClient. The callers and transport are supplied.

#include <iostream>
#include <map>
#include <optional>
#include <sstream>
#include <stdexcept>
#include <string>
#include <variant>
#include <vector>

struct ClientRequest {
    std::string tenant, provider;
    std::optional<std::string> sender, endpoint;
    std::optional<int> timeoutMs;
};

struct ClientPolicy {
    std::string prefix;
    int timeoutMs;
};

struct RelayClient {
    std::string tenant, address;
    int timeoutMs;

    std::string send(const std::string& payload) const {
        return tenant + "|relay|" + address + "|" + std::to_string(timeoutMs) + "|" + payload;
    }
};

using NotificationClient = std::variant<RelayClient>;

std::string send(const NotificationClient& client, const std::string& payload) {
    return std::visit([&](const auto& concrete) { return concrete.send(payload); }, client);
}

NotificationClient makeClient(const ClientRequest& request, const ClientPolicy& policy) {
    // TODO: meet the relay receipt requirements.

    if (request.tenant.empty()) throw std::invalid_argument("tenant is required");

    const int timeout = request.timeoutMs.value_or(0);
    if (timeout <= 0) throw std::invalid_argument("timeout must be positive");

    if (request.provider == "relay") {
        const auto sender = request.sender.value_or("");
        if (sender.empty() || (!request.sender && policy.prefix.empty())) {
            throw std::invalid_argument("sender is required");
        }

        return RelayClient{request.tenant, sender, timeout};
    }

    throw std::invalid_argument("unsupported provider");
}

NotificationClient apiClient(const std::string& tenant, const ClientPolicy& policy) {
    return makeClient({tenant, "relay", std::nullopt, std::nullopt, std::nullopt}, policy);
}

NotificationClient scheduledClient(const std::string& tenant, const ClientPolicy& policy) {
    return makeClient({tenant, "relay", std::nullopt, std::nullopt, 4000}, policy);
}

NotificationClient resendClient(const std::string& tenant, const ClientPolicy& policy) {
    return makeClient({tenant, "relay", "support/" + tenant, std::nullopt, std::nullopt}, policy);
}


// Supplied transport: '-' is absent and '~' is an explicitly empty field.
std::optional<std::string> optionalText(const std::string& word) {
    if (word == "-") return std::nullopt;
    return word == "~" ? "" : word;
}

int main() {
    std::map<std::string, ClientPolicy> policies;
    ClientRequest draft;
    std::string line;

    while (std::getline(std::cin, line)) {
        std::istringstream input(line);
        std::vector<std::string> words;
        std::string word;
        while (input >> word) words.push_back(word);
        if (words.empty()) continue;

        const auto payload = [&](std::size_t start) {
            std::string text;
            for (auto i = start; i < words.size(); ++i) {
                if (i != start) text += " ";
                text += words[i];
            }
            return text;
        };
        const auto& op = words[0];

        if (op == "P") {
            policies[words[1]] = {words[2] == "~" ? "" : words[2], std::stoi(words[3])};
        } else if (op == "R") {
            draft = {words[1] == "~" ? "" : words[1], words[2], optionalText(words[3]), optionalText(words[4]),
                words[5] == "-" ? std::nullopt : std::optional<int>(std::stoi(words[5]))};
        } else if (op == "A" || op == "S") {
            try {
                const auto client = op == "S" ? makeClient(draft, policies[draft.tenant])
                    : words[1] == "api" ? apiClient(words[2], policies[words[2]])
                    : words[1] == "scheduled" ? scheduledClient(words[2], policies[words[2]])
                    : resendClient(words[2], policies[words[2]]);
                std::cout << send(client, payload(op == "S" ? 1 : 3)) << '\n';
            } catch (const std::invalid_argument&) { std::cout << "rejected\n"; }
        }
    }
}


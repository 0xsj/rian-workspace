// Edit PreparedNotice, prepare and dispatch. Input handling and earlier helpers are below.

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

struct WebhookClient {
    std::string tenant, address;
    int timeoutMs;

    std::string send(const std::string& payload) const {
        return tenant + "|webhook|" + address + "|" + std::to_string(timeoutMs) + "|" + payload;
    }
};

using NotificationClient = std::variant<RelayClient, WebhookClient>;

std::string send(const NotificationClient& client, const std::string& payload) {
    return std::visit([&](const auto& concrete) { return concrete.send(payload); }, client);
}

NotificationClient makeClient(const ClientRequest& request, const ClientPolicy& policy) {
    if (request.tenant.empty()) throw std::invalid_argument("tenant is required");

    const int timeout = request.timeoutMs.value_or(policy.timeoutMs);
    if (timeout <= 0) throw std::invalid_argument("timeout must be positive");

    if (request.provider == "relay") {
        const auto sender = request.sender.value_or(policy.prefix + "/" + request.tenant);
        if (sender.empty() || (!request.sender && policy.prefix.empty())) {
            throw std::invalid_argument("sender is required");
        }

        return RelayClient{request.tenant, sender, timeout};
    }
    if (request.provider == "webhook") {
        const auto endpoint = request.endpoint.value_or("");
        if (!endpoint.starts_with("https://") || endpoint.size() <= 8) {
            throw std::invalid_argument("https endpoint is required");
        }

        return WebhookClient{request.tenant, endpoint, timeout};
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

struct PreparedNotice {
    std::optional<NotificationClient> client;
    std::string message;
};

PreparedNotice prepare(const ClientRequest& request, const ClientPolicy& policy, const std::string& message) {
    // TODO: meet the queued-notice receipt requirements.

    try { return {makeClient(request, policy), message}; }
    catch (const std::invalid_argument&) { return {std::nullopt, message}; }
}

std::string dispatch(const PreparedNotice& notice, const ClientPolicy&) {
    // TODO: meet the dispatch receipt requirements.

    return notice.client ? send(*notice.client, notice.message) : "rejected";
}

// Supplied transport: '-' is absent and '~' is an explicitly empty field.
std::optional<std::string> optionalText(const std::string& word) {
    if (word == "-") return std::nullopt;
    return word == "~" ? "" : word;
}

int main() {
    std::map<std::string, ClientPolicy> policies;
    ClientRequest draft;
    std::optional<NotificationClient> held;
    struct Queued { std::string tenant; PreparedNotice notice; };
    std::vector<Queued> pending;
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
        } else if (op == "B") {
            try {
                held = makeClient(draft, policies[draft.tenant]);
            } catch (const std::invalid_argument&) {
                held.reset();
            }
        } else if (op == "U") {
            std::cout << (held ? send(*held, payload(1)) : "rejected") << '\n';
        } else if (op == "A" || op == "S") {
            try {
                const auto client = op == "S" ? makeClient(draft, policies[draft.tenant])
                    : words[1] == "api" ? apiClient(words[2], policies[words[2]])
                    : words[1] == "scheduled" ? scheduledClient(words[2], policies[words[2]])
                    : resendClient(words[2], policies[words[2]]);
                std::cout << send(client, payload(op == "S" ? 1 : 3)) << '\n';
            } catch (const std::invalid_argument&) { std::cout << "rejected\n"; }
        } else if (op == "Q") {
            pending.push_back({draft.tenant, prepare(draft, policies[draft.tenant], payload(1))});
        } else if (op == "F") {
            for (const auto& item : pending) {
                std::cout << dispatch(item.notice, policies[item.tenant]) << '\n';
            }
            pending.clear();
        }
    }
}


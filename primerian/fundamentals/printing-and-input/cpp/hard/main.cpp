// Implement LinePrinter input assembly; all types, earlier helpers and the actual stdin adapter are supplied.
#include <charconv>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>
#include <string_view>

std::string formatProof(int id, double width) {
    std::ostringstream out;
    out << "proof " << std::setfill('0') << std::setw(3) << id
        << " | width: " << std::fixed << std::setprecision(2) << width << " cm";
    return out.str();
}
std::string countText(const std::string& raw) {
    const auto first = raw.find_first_not_of(" \t\r\n");
    if (first == std::string::npos) return "count missing";
    const auto last = raw.find_last_not_of(" \t\r\n");
    const auto text = raw.substr(first, last - first + 1);
    int value = 0;
    const auto result = std::from_chars(text.data(), text.data() + text.size(), value);
    if (result.ec != std::errc{} || result.ptr != text.data() + text.size()) return "count refused";
    return "count: " + std::to_string(value);
}

// Supplied display helper: make ASCII control characters visible in the output.
std::string quoteText(const std::string& line) {
    std::string result = "\"";
    for (char character : line) {
        switch (character) {
            case '\r': result += "\\r"; break;
            case '\n': result += "\\n"; break;
            case '\t': result += "\\t"; break;
            case '\\': result += "\\\\"; break;
            case '"': result += "\\\""; break;
            default: result += character;
        }
    }
    return result + "\"";
}

void emitLine(const std::string& line) {
    std::cout << formatProof(8, 12.5) << " | " << countText(line)
              << " | input: " << quoteText(line) << '\n';
}

class LinePrinter {
    std::string pending;

public:
    void push(std::string_view chunk) {

        // TODO: Turn input fragments into complete lines.

        (void)chunk;
    }

    void finish() {

        // TODO: Complete the input at EOF.

    }
};

// Supplied: actual stdin in nonempty fragments of at most 3 ASCII bytes.
int main() {
    LinePrinter printer;
    char buffer[3];
    for (;;) {
        std::cin.read(buffer, sizeof buffer);
        const auto n = std::cin.gcount();
        if (n > 0) {
            printer.push(std::string_view(buffer, static_cast<std::size_t>(n)));
        }
        if (!std::cin) break;
    }
    printer.finish();
}

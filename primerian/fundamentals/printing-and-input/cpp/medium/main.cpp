// Implement countText; the reader and earlier formatter are supplied.
#include <charconv>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>

std::string formatProof(int id, double width) {
    std::ostringstream out;
    out << "proof " << std::setfill('0') << std::setw(3) << id
        << " | width: " << std::fixed << std::setprecision(2) << width << " cm";
    return out.str();
}
std::string countText(const std::string& raw) {
    // TODO: distinguish blank, zero and failed complete conversion.
    return "TODO";
}
// Supplied: getline removes LF; a CR from CRLF can remain.
int main() {
    std::string line;
    if (std::getline(std::cin, line)) {
        std::cout << formatProof(8, 12.5) << " | " << countText(line) << '\n';
    }
}

// Edit formatProof; the complete reader and entry point below are supplied.
#include <charconv>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>

std::string formatProof(int id, double width) {
    // TODO: format the identifier and measurement independently.
    std::ostringstream out;
    out << "proof " << id << " | width: " << width << " cm";
    return out.str();
}
// Supplied reader: fixtures contain a valid ID and width separated by one space.
int main() {
    std::string line;
    if (std::getline(std::cin, line)) {
        std::istringstream input(line);
        int id; double width;
        input >> id >> width;
        std::cout << formatProof(id, width) << '\n';
    }
}

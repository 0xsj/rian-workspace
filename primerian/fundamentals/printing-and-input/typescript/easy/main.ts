// Edit formatProof; the complete reader and entry point below are supplied.
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

function formatProof(id: number, width: number): string {
  // TODO: format the identifier and measurement independently.
  return `proof ${id} | width: ${width} cm`;
}
// Supplied reader: fixtures contain a valid ID and width separated by one space.
async function main() {
  const lines = createInterface({ input: stdin, crlfDelay: Infinity });
  for await (const line of lines) {
    const [id, width] = line.split(" ").map(Number);
    stdout.write(formatProof(id, width) + "\n");
    break;
  }
}
void main();

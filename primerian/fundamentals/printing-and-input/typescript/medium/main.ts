// Implement countText; the reader and earlier formatter are supplied.
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

function formatProof(id: number, width: number): string {
  return `proof ${String(id).padStart(3, "0")} | width: ${width.toFixed(2)} cm`;
}
function countText(raw: string): string {
  // TODO: distinguish blank, zero and failed complete conversion.
  return "TODO";
}
// Supplied: read one actual stdin line and print its converted count.
async function main() {
  const lines = createInterface({ input: stdin, crlfDelay: Infinity });
  for await (const line of lines) {
    stdout.write(formatProof(8, 12.5) + " | " + countText(line) + "\n");
    break;
  }
}
void main();

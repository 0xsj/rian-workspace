// Implement LinePrinter input assembly; all types, earlier helpers and the actual stdin adapter are supplied.
import { stdin, stdout } from "node:process";

function formatProof(id: number, width: number): string {
  return `proof ${String(id).padStart(3, "0")} | width: ${width.toFixed(2)} cm`;
}
function countText(raw: string): string {
  const text = raw.trim();
  if (text === "") return "count missing";
  const value = Number(text);
  return Number.isNaN(value) ? "count refused" : `count: ${value}`;
}

function emitLine(line: string): void {
  stdout.write(
    formatProof(8, 12.5) + " | " + countText(line) + " | input: " + JSON.stringify(line) + "\n",
  );
}

class LinePrinter {
  private pending = "";

  push(chunk: string): void {

    // TODO: Turn input fragments into complete lines.

    void chunk;
  }

  finish(): void {

    // TODO: Complete the input at EOF.

  }
}

// Supplied: actual stdin, decoded as ASCII-compatible text and fragmented into at most 3 characters.
async function main() {
  const printer = new LinePrinter();
  stdin.setEncoding("utf8");
  for await (const block of stdin) {
    const text = String(block);
    for (let start = 0; start < text.length; start += 3) {
      printer.push(text.slice(start, start + 3));
    }
  }
  printer.finish();
}
void main();

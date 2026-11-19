// Implement LinePrinter input assembly; all types, earlier helpers and the actual stdin adapter are supplied.
package main

import (
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
)

func formatProof(id int, width float64) string {
	return fmt.Sprintf("proof %03d | width: %.2f cm", id, width)
}

// Available standard-library operations for your implementation.
var _ = strconv.Atoi
var _ = strings.TrimSpace

func countText(raw string) string {
	text := strings.TrimSpace(raw)
	if text == "" {
		return "count missing"
	}
	value, err := strconv.Atoi(text)
	if err != nil {
		return "count refused"
	}
	return fmt.Sprintf("count: %d", value)
}

func emitLine(line string) {
	fmt.Println(formatProof(8, 12.5) + " | " + countText(line) + " | input: " + strconv.Quote(line))
}

type LinePrinter struct {
	pending string
}

func (printer *LinePrinter) Push(chunk string) {

	// TODO: Turn input fragments into complete lines.

	_ = chunk
}

func (printer *LinePrinter) Finish() {

	// TODO: Complete the input at EOF.

}

// Supplied: actual stdin in nonempty fragments of at most 3 ASCII bytes.
func main() {
	var printer LinePrinter
	buffer := make([]byte, 3)
	for {
		n, err := os.Stdin.Read(buffer)
		if n > 0 {
			printer.Push(string(buffer[:n]))
		}
		if err != nil {
			if err == io.EOF {
				break
			}
			panic(err)
		}
	}
	printer.Finish()
}

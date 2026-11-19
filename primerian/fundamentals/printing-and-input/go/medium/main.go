// Implement countText; the reader and earlier formatter are supplied.
package main

import (
	"bufio"
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
	// TODO: distinguish blank, zero and failed complete conversion.
	return "TODO"
}

// Supplied: ReadString retains the delimiter in the text passed to countText.
func main() {
	line, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil && err != io.EOF {
		panic(err)
	}
	if err == io.EOF && len(line) == 0 {
		return
	}
	fmt.Println(formatProof(8, 12.5) + " | " + countText(line))
}

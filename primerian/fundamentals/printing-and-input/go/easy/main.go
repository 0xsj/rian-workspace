// Edit formatProof; the complete reader and entry point below are supplied.
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
	// TODO: format the identifier and measurement independently.
	return fmt.Sprintf("proof %d | width: %v cm", id, width)
}

// Supplied reader: fixtures contain a valid ID and width separated by one space.
func main() {
	line, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil && err != io.EOF {
		panic(err)
	}
	fields := strings.Fields(line)
	if len(fields) == 0 {
		return
	}
	id, _ := strconv.Atoi(fields[0])
	width, _ := strconv.ParseFloat(fields[1], 64)
	fmt.Println(formatProof(id, width))
}

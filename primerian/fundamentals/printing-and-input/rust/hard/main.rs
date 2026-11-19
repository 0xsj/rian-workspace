// Implement LinePrinter input assembly; all types, earlier helpers and the actual stdin adapter are supplied.
use std::io::{self, Read};

fn format_proof(id: i32, width: f64) -> String {
    format!("proof {:03} | width: {:.2} cm", id, width)
}
fn count_text(raw: &str) -> String {
    let text = raw.trim();
    if text.is_empty() {
        return "count missing".to_owned();
    }
    match text.parse::<i32>() {
        Ok(value) => format!("count: {}", value),
        Err(_) => "count refused".to_owned(),
    }
}

fn emit_line(line: &str) {
    println!(
        "{} | {} | input: {:?}",
        format_proof(8, 12.5),
        count_text(line),
        line
    );
}

#[derive(Default)]
struct LinePrinter {
    pending: String,
}

impl LinePrinter {
    fn push(&mut self, chunk: &str) {

        // TODO: Turn input fragments into complete lines.

        let _ = chunk;
    }

    fn finish(&mut self) {

        // TODO: Complete the input at EOF.

    }
}

// Supplied: actual stdin in nonempty fragments of at most 3 ASCII bytes.
fn main() -> io::Result<()> {
    let mut input = io::stdin().lock();
    let mut printer = LinePrinter::default();
    let mut buffer = [0_u8; 3];
    loop {
        let n = input.read(&mut buffer)?;
        if n == 0 {
            break;
        }
        let chunk = std::str::from_utf8(&buffer[..n]).expect("ASCII input");
        printer.push(chunk);
    }
    printer.finish();
    Ok(())
}

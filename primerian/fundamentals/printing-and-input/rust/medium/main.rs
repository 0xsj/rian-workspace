// Implement count_text; the reader and earlier formatter are supplied.
use std::io;

fn format_proof(id: i32, width: f64) -> String {
    format!("proof {:03} | width: {:.2} cm", id, width)
}
fn count_text(raw: &str) -> String {
    // TODO: distinguish blank, zero and failed complete conversion.
    "TODO".to_owned()
}
// Supplied: read_line retains the delimiter in the text passed to count_text.
fn main() -> io::Result<()> {
    let mut line = String::new();
    if io::stdin().read_line(&mut line)? > 0 {
        println!("{} | {}", format_proof(8, 12.5), count_text(&line));
    }
    Ok(())
}

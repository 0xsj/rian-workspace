// Edit format_proof; the complete reader and entry point below are supplied.
use std::io;

fn format_proof(id: i32, width: f64) -> String {
    // TODO: format the identifier and measurement independently.
    format!("proof {} | width: {} cm", id, width)
}
// Supplied reader: fixtures contain a valid ID and width separated by one space.
fn main() -> io::Result<()> {
    let mut line = String::new();
    if io::stdin().read_line(&mut line)? == 0 { return Ok(()); }
    let mut fields = line.split_whitespace();
    let id = fields.next().unwrap().parse::<i32>().unwrap();
    let width = fields.next().unwrap().parse::<f64>().unwrap();
    println!("{}", format_proof(id, width));
    Ok(())
}

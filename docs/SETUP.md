# Local tools

Run `npm ci` once at the workspace root. It installs the pinned TypeScript
compiler and Node type declarations. The workspace commands otherwise use Node's
standard library. They do not install language toolchains for you.

| Edition | Required tools | Check |
| --- | --- | --- |
| TypeScript | Node 22.18+; workspace npm dependencies | `npm run doctor -- typescript` |
| Go | Go 1.23 or newer | `npm run doctor -- go` |
| Rust | Rust and Cargo supporting edition 2024 (Rust 1.85+) | `npm run doctor -- rust` |
| C++ | `g++` or `clang++` supporting C++23 | `npm run doctor -- cpp` |

The C++ runner uses `CXX` when set, then `c++`. Source and execution preserves
the commands in its editable `tasks.json`, including `g++`; change that command
to your installed compiler if necessary. `CXX` is a program path, not a string
containing compiler flags.

The initial build/run tasks use POSIX shell syntax. macOS and Linux work directly;
on Windows use WSL with Node, npm and the selected toolchain installed inside WSL.
Native Windows shell support is not included in this version.

Install tools using their official guides:

- Node: https://nodejs.org/en/download
- Go: https://go.dev/doc/install
- Rust: https://www.rust-lang.org/tools/install
- C++: your system's GCC or Clang packages

All initial exercises work without databases, API credentials or network services
after dependencies are installed. Factory's transports produce local receipts;
they do not deliver notifications. Future service-based exercises must document
their own setup before appearing in the catalog.

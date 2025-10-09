---
layout: post
title:  "Getting started in Rust"
categories: rust
plugins: mermaid
last_edit: 2023-04-19
---

## Installing Rust:

Using Rustup:
```zsh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

> Note: It is also possible to install rust via `homebrew` however `rustup` is the community recommended approach which allows for multiple versions of rust on the same computer. [source](https://sourabhbajaj.com/mac-setup/Rust/)


## Cargo
Cargo is a build tool for Rust. It is also used to manage packages of libraries and applications. When installing Rustup you will get the latest stable version of cargo.


`cargo --version `
: To check the version of rust you are running

`cargo new ${project-name}`
: Create a new project

`cargo build `
: build your project

`cargo run `
: run your project

`cargo test `
: test your project

`cargo doc `
: build documentation for your project

`cargo publish `
: publish a library to crates.io

## Example: Streaming Math

`cargo new streaming-math`

Will create the following project:

```mermaid
    ---
    title: Streaming Math Directory
    ---
    flowchart LR
    project(streaming-math) --> src(src) --> main[/main/]
    src --> Cargo[/Cargo.toml/]
```

`Cargo.toml`
: The manifest file for Rust. Project metadata and dependencies are defined here.

`src/main.rs`
: The source directory and entry point for your code.

source: **[{% include github-icon.html %} streaming-math]({{ site.playground_urls.tree }}/rust/streaming-math)**
{: style="clear: both"}

### Running the initial project

Enter the project (`cd streaming-math`) and run (`cargo run`) and you will see the following

```
Hello, world!
```

### Initial implementation:

For this project I aim to create a simple app which streams 2 files summing up corresponding lines between each file.  We will provide some safety by checking for Ok Results and handling non-matching results.

1. Opens 2 files passed in by argument ([Accepting Command Line Arguments](https://doc.rust-lang.org/book/ch12-01-accepting-command-line-arguments.html))
2. Streams through both files ([BufReader.lines](https://doc.rust-lang.org/rust-by-example/std_misc/file/read_lines.html#efficient-method))
3. Zips both streams together ([Iterator.zip](https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.zip))
4. Parses each line as an int ([parse](https://doc.rust-lang.org/std/primitive.str.html#method.parse))
5. Sums up both rows

```rust
use std::env;

use std::fs::File;
use std::io::{self,BufRead,BufReader,Result,Lines};
use std::path::Path;

fn main() {
    let args: Vec<String> = env::args().collect();
    let path1 = &args[1];
    let path2 = &args[2];

    if let (Ok(lines1), Ok(lines2)) = (read_lines(path1), read_lines(path2)) {
        for (line1, line2) in lines1.zip(lines2) {
            if let (Ok(one), Ok(two)) = (line1, line2) {
                if let(Ok(one_int), Ok(two_int)) = (one.parse::<i32>(), two.parse::<i32>()) {
                    println!("{}", one_int + two_int )
                } else {
                    println!("Unable to add {}<from: {}> + {}<from: {}>", one, path1, two, path2);
                }
            }
        }
    } else {
        println!("Unable to open both files: {} or {}", path1, path2)
    }
}

fn read_lines<P>(path: P) -> Result<Lines<BufReader<File>>>
where P: AsRef<Path>, {
    let file = File::open(path)?;
    Ok(io::BufReader::new(file).lines())
}
```

### Testing the results:

When we execute:
`cargo run -- <(for num in 1 2 3 4 5; echo $num) <(for num in 9 8 7 6 5; echo $num)`

We get the following:
```
   Compiling streaming-math v0.1.0 (/Users/stephen/source/StephenSmithwick.github.io/streaming-math)
    Finished dev [unoptimized + debuginfo] target(s) in 0.87s
     Running `target/debug/streaming-math /dev/fd/11 /dev/fd/13`
10
10
10
10
10
```

More reading:
- [Concise Control Flow with if let](https://doc.rust-lang.org/book/ch06-03-if-let.html)
- [SIMD](https://doc.rust-lang.org/std/simd/index.html) - [by example](https://www.cs.brandeis.edu/~cs146a/rust/rustbyexample-02-21-2015/simd.html)
- [Excercism](https://exercism.org/tracks/rust)

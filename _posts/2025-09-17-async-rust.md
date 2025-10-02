---
layout: post
title:  An Exploration of Async Rust
categories: rust
published: false
needs-work: unpublished
# last_edit:
---

[state-of-async]: https://corrode.dev/blog/async

[//]: # (smol)
[smol]: https://github.com/smol-rs/smol

[//]: # (Tokio)
[tokio]: https://github.com/tokio-rs/tokio
[reqwest]: https://github.com/seanmonstar/reqwest
[futures-rs]: https://github.com/rust-lang/futures-rs
[actson-rs]: https://github.com/michel-kraemer/actson-rs

[//]: # (Other)
[embassy]: https://github.com/embassy-rs/embassy
[glommio]: https://github.com/DataDog/glommio
[sqlx]: https://github.com/launchbadge/sqlx

I want to explore async rust options.  I will focus on a service which relies on making http streaming requests to a llama.cpp server(`llama-server -hf unsloth/Qwen3-0.6B-GGUF --jinja`).

The request:
```bash
printf "Key: \u001b[34m Reasoning \u001b[0m | \u001b[32m Content \u001b[0m \n";
curl -sN http://localhost:8080/v1/chat/completions -d @- << JSON \
| sed 's/data: //'  | sed 's/\[DONE\]//' \
| jq -jr '
    "\u001b[32m"    + .choices[].delta.content              + "\u001b[0m" +
    "\u001b[34m"    + .choices[].delta.reasoning_content    + "\u001b[0m"
'; echo  
{
    "messages": [
        {
            "role": "user",
            "content": "Why is the sky blue?"
        }
    ],
    "stream": true
}
JSON
```
The request
```bash
networksetup -listallhardwareports # I want to listen to en1
sudo tcpdump -i en1 -s 0 -B 524288 -w DumpFile01.pcap
# now call above curl command
```

## [smol][smol]
```rust
use smol::{io, net, prelude::*, Unblock};

fn main() -> io::Result<()> {
    smol::block_on(async {
        let mut stream = net::TcpStream::connect("localhost:8080:80").await?;
        let req = b"GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n";
        stream.write_all(req).await?;

        let mut stdout = Unblock::new(std::io::stdout());
        io::copy(stream, &mut stdout).await?;
        Ok(())
    })
}
```

## [Tokio][tokio]
Tokio is an async library ecosystem within rust.  

Most example Tokio code marks the main function with `#[tokio::main]` to make the entire project asynchronous.

The `#[tokio::main]` macro is a macro that replaces your main function with a non-async main function that starts a runtime and then calls your code

<div class="columns-2" markdown="1">

```rust
#[tokio::main]
async fn main() {
    println!("Hello world");
}
```
{:.column}

```rust
fn main() {
    tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap()
        .block_on(async {
            println!("Hello world");
        })
}
```
{:.column}

</div>

In where a portion of synchronous code is needed, For instance, a GUI application might want to run the GUI code on the main thread and run a Tokio runtime next to it on another thread.

### [reqwest][reqwest]
Reqwest is an io library which work within tokio to provide non-blocking io.

## [embassy][embassy]

## [glommio][glommio]

## What about threads

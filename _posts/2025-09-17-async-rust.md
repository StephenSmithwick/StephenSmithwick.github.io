---
layout: post
title:  An Exploration of Async Rust
categories: rust
published: false
needs-work: unpublished
# last_edit:
---

[state-of-async]: https://corrode.dev/blog/async
[smol]: https://github.com/smol-rs/smol
[tokio]: https://github.com/tokio-rs/tokio
[reqwest]: https://github.com/seanmonstar/reqwest
[actson-rs]: https://github.com/michel-kraemer/actson-rs
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
Overview of Tokio.

### [reqwest][reqwest]
Usage of reqwest

## [embassy][embassy]

## [glommio][glommio]

## What about threads

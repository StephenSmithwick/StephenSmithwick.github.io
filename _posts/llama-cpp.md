---
layout: post
title:  "Playing with alpaca.cpp and llama.cpp"
date:   2023-03-24
categories: ml
published: false
---

# Setup
```zsh
mkdir -p llama-alpaca
cd llama-alpaca

# Creating models
mkdir models
(
    cd models

    # Alpaca models
    for url in https://gateway.estuary.tech/gw/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC \
            https://ipfs.io/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC \
            https://cloudflare-ipfs.com/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC;
        echo "Trying $url" && curl -o ggml-alpaca-7b-q4.bin -C - $url && break
)
ln models/ggml-alpaca-7b-q4.bin .

# alpaca.cpp
git clone git@github.com:antimatter15/alpaca.cpp.git
(
    cd alpaca.cpp
    make chat
    ln chat ../alpaca
)


./alpaca -m models/ggml-alpaca-7b-q4.bin -f <(echo "
### Instruction: \
All Germans speak Italian. All Italian speakers ride bicycles. \
Which of the following statements is true? You must choose one of the following: \
1- All Italians speak German \
2- All bicycle riders are German \
3- All Germans ride bicycles \
4- Some of the Italians riding bicycles are Germans \
\
### Response: ")


# llama.cpp
git clone git@github.com:ggerganov/llama.cpp.git
(
    cd llama.cpp
    make -j
    ln main ../llama
)

./llama -m models/ggml-alpaca-7b-q4.bin -f <(echo "
### Instruction: 
All Germans speak Italian. All Italian speakers ride bicycles. 
Which of the following statements is true? You must choose one of the following: 
1- All Italians speak German 
2- All bicycle riders are German 
3- All Germans ride bicycles 
4- Some of the Italians riding bicycles are Germans 

### Response: ")
```

```
Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
All Germans speak Italian. All Italian speakers ride bicycles. 
Which of the following statemens is true? You must choose one of the following: 
1- All Italians speak German 
2- All bicycle riders are German 
3- All Germans ride bicycles 
4- Some of the Italians riding bicycles are Germans 

### Response:
```
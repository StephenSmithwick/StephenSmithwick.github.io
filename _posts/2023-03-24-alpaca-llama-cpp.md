---
layout: post
title:  "Playing with alpaca.cpp and llama.cpp"
categories: ml
---

This is an exploration of [Stanford's Alpaca language model][1].  Alpaca is based on the [Facebook's LLaMA language model][2] but is fine tuned to respond to instructions.  The LLaMA and derived Alpaca models comes in multiples sizes with greater resources needed for the larger models: 7B, 13B, 30B and 65B parameters.

Facebook provides a reference python project to run the models: ([Facebook repo to load model][3]).  An open source project [llama.cpp][4] been developed to run the LLaMA model using C++ and [ggml][5] which can run the LLaMA and Alpaca models with some modifications (quantization of the weights for consumption by ggml).  Additionally, there is a branch of `llama.cpp` called [alpaca.cpp][6] which specifically targets the alpaca models to provide a chat like interface. Specifically `alpaca.cpp` uses an [open reproduction][7] of Stanford's Alpaca.

Further reading: 
- [RLHF][8]

## Acquiring the models
For this exploration of the Alpaca models let us start with the smallest model (7B parameters) with weights which have been quantized to 4 bits to optimize for running with lower resources.

Fetching the model:
```zsh
mkdir models
(
    cd models

    # Download Alpaca models
    for url in https://gateway.estuary.tech/gw/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC \
            https://ipfs.io/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC \
            https://cloudflare-ipfs.com/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC;
        echo "Trying $url" && curl -o ggml-alpaca-7b-q4.bin -C - $url && break


    # Converting the Alpaca model for use with llama.cpp
    curl -o tokenizer.model -C - $(curl -s https://huggingface.co/decapoda-research/llama-7b-hf/resolve/main/tokenizer.model | grep -o "https://.*")
    curl -o convert.py -C - https://gist.githubusercontent.com/eiz/828bddec6162a023114ce19146cb2b82/raw/6b1d2b192815e6d61386a9a8853f2c3293b3f568/gistfile1.txt

    brew install cmake
    pip3 install sentencepiece

    python3 convert.py . tokenizer.model
    mv ggml-alpaca-7b-q4.bin.tmp ggml-alpaca-7b-q4.llama.bin
)
```

## Compiling and linking `alpaca.cpp` and `llama.cpp`


```zsh
# alpaca.cpp
git clone git@github.com:antimatter15/alpaca.cpp.git
(
    cd alpaca.cpp
    make chat
    ln chat ../alpaca
)

# llama.cpp
git clone git@github.com:ggerganov/llama.cpp.git
(
    cd llama.cpp
    make -j
    ln main ../llama
)
```

## Testing `alpaca.cpp` 

```zsh
./alpaca -m models/ggml-alpaca-7b-q4.bin -f
```

```
main: seed = 1680108934
llama_model_load: loading model from 'models/ggml-alpaca-7b-q4.bin' - please wait ...
llama_model_load: ggml ctx size = 6065.34 MB
llama_model_load: memory_size =  2048.00 MB, n_mem = 65536
llama_model_load: loading model part 1/1 from 'models/ggml-alpaca-7b-q4.bin'
llama_model_load: .................................... done
llama_model_load: model size =  4017.27 MB / num tensors = 291

system_info: n_threads = 4 / 8 | AVX = 0 | AVX2 = 0 | AVX512 = 0 | FMA = 0 | NEON = 1 | ARM_FMA = 1 | F16C = 0 | FP16_VA = 1 | WASM_SIMD = 0 | BLAS = 1 | SSE3 = 0 | VSX = 0 | 
main: interactive mode on.
sampling parameters: temp = 0.100000, top_k = 40, top_p = 0.950000, repeat_last_n = 64, repeat_penalty = 1.300000


== Running in chat mode. ==
 - Press Ctrl+C to interject at any time.
 - Press Return to return control to LLaMA.
 - If you want to submit another line, end your input in '\'.
```

> \> who was the chancellor of Germany in 2020
{:.dark-green}

> Angela Merkel

> \> what have been Angela Merkel's major accomplishments
{:.dark-green}

> Merkel has served as Chancellor since November, 2005. She is the longest-serving leader in Europe and one of its most influential leaders internationally. Her achievements include helping to broker a deal between Greece’s creditors that prevented Athens from defaulting on debt; negotiating an agreement with Russia over Ukraine's Crimea region, which led to the lifting of EU sanctions against Moscow in 2015 and helped ease tensions. Merkel also played a key role in brokering peace between Israelis and Palestinians at Camp David talks last year; she has been instrumental in helping Germany navigate its relationship with Turkey, which is now one of the most important partnerships for Berlin’s foreign policy agenda.

## Testing `llama.cpp`
```zsh
./llama -n -1 -m models/ggml-alpaca-7b-q4.llama.bin -f einsteins-riddle.txt
```

```
main: seed = 1680109387
llama_model_load: loading model from 'models/ggml-alpaca-7b-q4.llama.bin' - please wait ...
llama_model_load: n_vocab = 32000
llama_model_load: n_ctx   = 512
llama_model_load: n_embd  = 4096
llama_model_load: n_mult  = 256
llama_model_load: n_head  = 32
llama_model_load: n_layer = 32
llama_model_load: n_rot   = 128
llama_model_load: f16     = 2
llama_model_load: n_ff    = 11008
llama_model_load: n_parts = 1
llama_model_load: type    = 1
llama_model_load: ggml ctx size = 4273.34 MB
llama_model_load: mem required  = 6065.34 MB (+ 1026.00 MB per state)
llama_model_load: loading model part 1/1 from 'models/ggml-alpaca-7b-q4.llama.bin'
llama_model_load: .................................... done
llama_model_load: model size =  4017.27 MB / num tensors = 291
llama_init_from_file: kv self size  =  256.00 MB

system_info: n_threads = 4 / 8 | AVX = 0 | AVX2 = 0 | AVX512 = 0 | FMA = 0 | NEON = 1 | ARM_FMA = 1 | F16C = 0 | FP16_VA = 1 | WASM_SIMD = 0 | BLAS = 1 | SSE3 = 0 | VSX = 0 | 
sampling: temp = 0.800000, top_k = 40, top_p = 0.950000, repeat_last_n = 64, repeat_penalty = 1.100000
generate: n_ctx = 512, n_batch = 8, n_predict = -1, n_keep = 0


 
### Instruction: 
There are five houses in a row. Each house is painted a different color and has a person of a different nationality living in it. Each person drinks a different beverage, smokes a different type of cigar, and owns a different animal as a pet. Using these 15 clues, which person owns the pet fish?

The Brit lives in the red house.
The Swede has a pet dog.
The Dane drinks tea.
The green house is directly to the left of the white house.
The person in the green house drinks coffee.
The person who smokes Pall Mall has a pet bird.
The person in the yellow house smokes Dunhill cigars.
The person in the center house drinks milk.
The Norwegian lives in the first house.
The person who smokes Blends lives next to the person with the pet cat.
The person with the pet horse lives next to the one who smokes Dunhill.
The person who smokes BlueMaster drinks beer.
The German smokes Prince.
The Norwegian lives next to the blue house.
The person who smokes Blends has a neighbor who drinks water.

### Response: 
The pet fish belongs to the German. [end of text]

llama_print_timings:        load time =  2675.75 ms
llama_print_timings:      sample time =     7.61 ms /    10 runs   (    0.76 ms per run)
llama_print_timings: prompt eval time = 25471.90 ms /   271 tokens (   93.99 ms per token)
llama_print_timings:        eval time =  1245.02 ms /     9 runs   (  138.34 ms per run)
llama_print_timings:       total time = 29757.34 ms
```


## About Hallucinations:

These language models are impressive but one major risk is the lack of transparency in how they arrive at their answer.  Furthermore, these models can quite confidently tell you something which is not true: [Stanford Researchers Take Down Alpaca AI Due to 'Hallucinations'][9] 

A trivial example.  I ran this query through the model 3 times:
```zsh
./llama -m models/ggml-alpaca-7b-q4.llama.bin -f <(echo "
### Instruction: 
Solve for x: 

### Input:
2x^2 + 6x = 20

### Response: ")
```

I received the following incorrect results:
- `x = sqrt(2) [end of text]`
- `x = 4 [end of text]`
- `x = ±√(24/2) [end of text]`


[1]: https://github.com/tatsu-lab/stanford_alpaca
[2]: https://ai.facebook.com/blog/large-language-model-llama-meta-ai/
[3]: https://github.com/facebookresearch/llama
[4]: https://github.com/ggerganov/llama.cpp
[5]: https://github.com/ggerganov/ggml
[6]: https://github.com/antimatter15/alpaca.cpp
[7]: https://github.com/tloen/alpaca-lora
[8]: https://huggingface.co/blog/rlhf
[9]: https://gizmodo.com/stanford-ai-alpaca-llama-facebook-taken-down-chatgpt-1850247570
#! /bin/sh

./llama -m models/ggml-alpaca-7b-q4.llama.bin -f <(echo "
### Instruction: 
Improve grammar of text

### Input:
Functor
A transformation that maps objects of a category into objects of another category preserving structure. Typically a functor can be said to contain another class. Classic examples are the java Stream and Optional classes. In Kotlin and most functional languages Collection classes are Monads.

An example in Java is Optional which allows the contained value to be modified via the ::map function.

### Response: ")
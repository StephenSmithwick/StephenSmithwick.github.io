---
layout: post
title:  "My Brewfile"
categories: dev-desktop
---

To save on setup, I keep an updated list of applications I like on my mac.  I use [homebrew](https://brew.sh/) and the [Homebrew Bundle](https://github.com/Homebrew/homebrew-bundle) feature based on ruby [bundler](https://bundler.io/) tool.

## Install
To install brew:
```zsh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Download the brewfile locally: 
```zsh
curl https://gist.githubusercontent.com/StephenSmithwick/e77bb2c572b320631ecef3f0d8740927/raw/4b588ff4322e239470c63ff89ffdddae1ffa8eae/Brewfile \
--output Brewfile
```

In the same directory we downloaded the Brewfile run:
```zsh
brew bundle
```

## [Gist: Brewfile](https://gist.github.com/StephenSmithwick/e77bb2c572b320631ecef3f0d8740927)

<script src="https://gist.github.com/StephenSmithwick/e77bb2c572b320631ecef3f0d8740927.js"></script>




---
layout: post
title:  "My Brewfile"
categories: dev-desktop
date:   2024-11-15
last_edit: 2025-01-29
---

To save on setup, I keep an updated list of applications I like on my mac.  I use [homebrew](https://brew.sh/) and the [Homebrew Bundle](https://github.com/Homebrew/homebrew-bundle) feature which is inspired by ruby [bundler](https://bundler.io/) tool.

## Install
To install brew:
```zsh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Download the brewfile locally:
```zsh
curl {{ site.github_urls.raw }}/Brewfile \
 --output Brewfile
```

In the same directory we downloaded the Brewfile run:
```zsh
brew bundle
```

## [Brewfile]({{ site.github_urls.blob }}/Brewfile)

<script src="https://emgithub.com/embed-v2.js?target={{ site.github_urls.blob }}/Brewfile&style=default&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>

## To Work around Apple's Strict Notarization
Apple requires applications be signed by a registered Apple developer account before a user executes them.
To override this safety feature see: [Disabling GateKeeper]({% post_url 2025-01-10-Disable-GateKeeper %})

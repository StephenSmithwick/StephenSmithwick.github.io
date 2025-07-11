---
layout: post
title:  "My Brewfile"
categories: dev-desktop
date:   2024-11-15
last_edit: 2025-07-11
---

To streamline my setup, I maintain an updated list of applications I prefer on my Mac. I use [Homebrew](https://brew.sh/) and its [Homebrew Bundle](https://github.com/Homebrew/homebrew-bundle) feature, which is inspired by Ruby's [Bundler](https://bundler.io/) tool.

## Installation
To install Homebrew:
```zsh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Download the Brewfile locally:
```zsh
curl {{ site.github_urls.raw }}/Brewfile \
 --output Brewfile
```

In the same directory where you downloaded the Brewfile, run:
```zsh
brew bundle
```

## [Brewfile]({{ site.github_urls.blob }}/Brewfile)

<script src="https://emgithub.com/embed-v2.js?target={{ site.github_urls.blob }}/Brewfile&style=default&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>

## Working Around Apple's Strict Notarization
Apple requires applications be signed by a registered Apple developer account before a user can execute them. To override this safety feature, refer to: [Disabling GateKeeper]({% post_url 2025-01-10-Disable-GateKeeper %})

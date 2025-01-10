---
layout: post
title:  "Disabling Gatekeeper"
categories: dev-desktop
---

Below I discuss how to disabled Gatekeeper using a custom generated profile.
I built the script based on the contents of this gist: [gist:hoishing/README.md](https://gist.github.com/hoishing/cadd905b095e15531467255b537f6906)

Gatekeeper makes your desktop more secure by restricting what applications can be run on it.
This is undoubtably makes your more computer more safe and you should be wary before you disable it.

If you are willing to take the risk the rest of this blog post will provide instructions and a helpful script to disable GateKeeper.

## Disabling GateKeeper
Execute the script:
```zsh
/bin/bash -c "$(curl -fsSL {{ site.github_urls.raw }}/allow-unsigned.sh)"
```

The script(see below) will:
1. Generates a new profile which disables GateKeeper
2. Loads the new profile
3. Opens System Settings to the new Profile Loader
4. [Manual] If you are certain that you wish to disable GateKeeper then you must load the profile.

## [allow-unsigned.sh]({{ site.github_urls.blob }}/allow-unsigned.sh)
<script src="https://emgithub.com/embed-v2.js?target={{ site.github_urls.blob }}/allow-unsigned.sh&style=default&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>

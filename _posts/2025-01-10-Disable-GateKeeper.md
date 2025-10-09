---
layout: post
title:  "Disabling Gatekeeper"
categories: dev-desktop
last_edit: 2025-01-29
---

You may want to disable Gatekeeper if you are trying to execute code which has not been signed.

Gatekeeper makes your desktop more secure by requiring applications be [signed with a developer id](https://developer.apple.com/developer-id).
The problem is that obtaining a developer id costs an annual subscription fee from Apple.

If you are willing to forgo the extra safety that Gatekeper provides this blog post provides instructions and a helpful script to disable it using a custom generated profile.  I built the script based on the contents of this gist: \\
[gist:hoishing/README.md](https://gist.github.com/hoishing/cadd905b095e15531467255b537f6906)

## Disabling GateKeeper
Execute the script:
```zsh
/bin/bash -c "$(curl -fsSL {{ site.playground_urls.raw }}/osx-fixes/allow-unsigned.sh)"
```

The script:
1. Generates a new profile which disables GateKeeper
2. Loads the new profile
3. Opens System Settings to the new Profile Loader
4. [Manual] If you are certain that you wish to disable GateKeeper then you must load the profile.

## [allow-unsigned.sh]({{ site.playground_urls.blob }})
{% include embed.html playground="/osx-fixes/allow-unsigned.sh" %}

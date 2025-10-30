---
layout: post
title: My Development Environment
published: true
categories: dev-desktop
---

## Installation
Ensure your Brewfile contains the following:

**📄 Brewfile**
{:.code-title}
```ruby
brew "entr" # auto-run tests on file change
brew "vale" # grammar and spell check server

cask_args appdir: "/Applications"
cask "zed" # Native editor similar to sublime and vscode written in Rust
```


Install dependencies using: `brew bundle`

## To Edit
Open your project folder in Zed: `zed .`

## Autorun Tests
While editing, I like to have tests running continuously on file changes. This gives fast feedback and helps me stay focused.

A handy way to do this is by using `entr` in a split or embedded terminal (toggle with `Control` + ``` ` ``` in most terminals or editors):

```bash
ls -R src  | entr -r execute_tests.sh
```

## Spell and Grammar check

1. Add a vale configuration file your home directory (note: vale searches for a config file recursively checking each parent directory for a config)

    **📄 ~/.vale.ini**
    {:.code-title}
    ```ini
    StylesPath = .github/styles
    MinAlertLevel = suggestion

    # Packages = Microsoft, proselint, write-good, alex, Readability, Joblint
    Packages = write-good

    [*.md]
    BasedOnStyles = Vale, write-good
    ```
2. Synchronize to your home vale config: `vale sync`
3. Search for extension `Vale Language Server` in zed (`⌘`+`⇧ Shift`+`X`) and install

To setup vale per project create a `.vale.ini` file at the project root and then re-run `vale sync` from the project root.

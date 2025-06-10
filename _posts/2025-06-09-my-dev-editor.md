---
layout: post
title: My Development Environment
published: true
categories: dev-desktop
---

## Installation
Ensure your Brewfile contains the following:
###### 📄 Brewfile
```ruby
brew "entr"
cask_args appdir: "/Applications"
cask "zed"
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

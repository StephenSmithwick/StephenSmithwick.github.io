---
layout: post
title:  A Review of Agentic Agents
categories: ml
published: true
# last_edit:
---

[//]: # (Agents)
[opencode]: https://opencode.ai/docs/cli/
[crush]: https://github.com/charmbracelet/crush
[gemini-cli]: https://cloud.google.com/gemini/docs/codeassist/gemini-cli
[claude-code]: https://docs.claude.com/en/docs/claude-code/overview

[//]: # (Repos)
[git-opencode]: https://github.com/sst/opencode
[git-crush]: https://github.com/charmbracelet/crush
[git-gemini-cli]: https://github.com/google-gemini/gemini-cli
[git-claude-code]: https://github.com/anthropics/claude-code

[//]: # (Documentation)
[docs-mcp]: https://modelcontextprotocol.io/docs/getting-started/intro

Here is a survey of various agents and concepts I have come across during my research into using and building agents.
I wanted to keep a central post in which I can re-find some of these resources

# Concepts
Model Context Protocol (MCP) server
: MCP gives agents extensible access to your tools (including custom tools - see documentation below) 
: A standard for providing tool calling agents with functions and how to call them.
: These local or remote servers can may sockets or http
: [Documentation][docs-mcp]

Language Service Protocol (LSP)
: To aid the LLM in writing syntactically correct code

YOLO Mode
: Often agents must ask for permission before they make a call
: YOLO (You Only Live Once) mode give the model permission to execute all possible tools without permission
: Depending on the tool and it's implementation: this can be dangerous

Model Access
: Many agents allow you to plugin you own model including local LLM
: The agent will usually require a key to access your account
: Agent performance can vary signigicantly depending on the model it uses and some agents are better for some models.

# Agents
- [Opencode][opencode] - [git][git-opencode]
- [Crush][crush]
- [Gemini CLI][gemini-cli] - [git][gemini-cli-git]
- [Claude Code][claude-code] - [git][[git-claude-code]]

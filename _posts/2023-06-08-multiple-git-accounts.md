---
layout: post
title:  "Configuring Git Access Per Repository"
categories: git
---

Many developers need to access Git repositories with different accounts on the same laptop. My particular challenge was configuring a single Git repository to use a different account. While there is varying advice online on how to achieve this, I wanted a best-practices approach that adhered to the following principles:

### Principles:
No manual edits of Git config
: While Git config files are easy to understand, using `git config` is more repeatable, less error-prone, and future-proof.

Minimal changes to SSH config
: To minimize the impact of any changes to Git.

## Generating a Separate SSH Key and Adding It to GitHub
Git authentication over SSH is secure and easy to manage. It is best practice to generate a separate SSH key for each machine. This allows you to revoke access individually and eliminates the need to transfer private keys between machines. Many of the following steps were rediscovered using GitHub’s excellent [documentation][1].

1. Generate an SSH key (this is the only change to the SSH config directory):
```zsh
ssh-keygen -t ed25519 -C "${personal_email}"
```
When prompted for a file location, choose a non-default key name, such as: `~/.ssh/${personal_git_key}`
2. Log in to GitHub and navigate to the [SSH keys settings page](https://github.com/settings/keys).
3. Copy the newly generated public key: `cat ~/.ssh/${personal_git_key} | pbcopy`
4. Add a "New SSH Key" in Github:

    Title
    : Work Laptop

    Key
    : (Paste the public key copied in Step 3.)

## Configuring Git to Use the New Key for a Specific Repository
1. Clone the repository with separate user access: `git clone git@github.com:${user_name}/${repo}`
2. Navigate into the repository: `cd ${repo}`
3. Modify the user and authentication settings for this repository only (not using the `--global` flag):
```zsh
git config user.name "${user_name}"
git config user.email "${user_email}"
git config core.sshCommand "ssh -i ~/.ssh/${personal_git_key}"
```

Special thanks to Dmytro Buryak, whose [stack overflow post][2] pointed me in the right direction. Additionally, Git’s [official documentation][3] was a helpful reference.  If you need to configure multiple local repositories with different accounts, Dmytro provides a particularly clever way of associating Git configurations at the root directory level—check out his post for more details.

[1]: (https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
[2]: (https://superuser.com/questions/232373/how-to-tell-git-which-private-key-to-use#answer-1664624)
[3]: (https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)

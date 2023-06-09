---
layout: post
title:  "Configuring git Access per Repository"
categories: git
---

Many developers have access to git repositories with different accounts on the same laptop.  My particular problem was to setup a single git repository with a different account. There is varying advice online on how to accomplish this but I was looking for a best practices way that honored the following principals:

No manual edits of git config
: Git config files are easy to understand but using `git config` allows more precise config changes and leverages git to modify the correct git file with the correct config structure.

Minimal changes to ssh config
: To reduce blast radius of any change to git.

## Generating my separate ssh key and sharing with Github
Git authentication over ssh is secure and easy to manage day-to-day.  It is best practice to generate a separate ssh key per machine.  This allows you to individually revoke access and avoids moving private keys off the machine.  Much of the following steps were rediscovered by me using the excellent [Github Documentaition][1]. 

1. Generate an ssh key (This is the only change to the ssh config directory). 
```zsh
ssh-keygen -t ed25519 -C "${personal_email}" 
```
At the ssh file location prompt choose a non default keyname like: `~/.ssh/${personal_git_key}`
2. Login to github and navigate to the ssh keys [settings page](https://github.com/settings/keys).
3. Copy my newly generate public key: `cat ~/.ssh/${personal_git_key} | pbcopy`
4. Add a "New SSH Key"

    Title
    : Work Laptop

    Key
    : <Public key copied in Step 3>

## Configuring `git` to use the new key for my repo
1. Clone the repository with separate user access: `git clone git@github.com:${user_name}/${repo}` 
2. `cd ${repo}`
3. Modify user and authentication for this repository only (Note that we are not setting the `--global` config)
```zsh
git config user.name "${user_name}" 
git config user.email "${user_email}"
git config core.sshCommand "ssh -i ~/.ssh/${personal_git_key}"
```

Thanks goes to Dmytro Buryak whose [stack overflow post][2] pointed me in the right direction and with reference to this [git documentation][3].  If you need to setup many local repositories with different accounts Dmytro has a particularly clever way of associating a git configs at root directory level.  I recomend you check out his post for more details.

[1]: (https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
[2]: (https://superuser.com/questions/232373/how-to-tell-git-which-private-key-to-use#answer-1664624)
[3]: (https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)
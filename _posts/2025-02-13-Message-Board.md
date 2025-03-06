---
layout: post
title: Message Board for my Blog
# last_edit: 2025-02-13
published: true
categories: devops
---

I set out to create a free tier, no privileged service to allow users to comment on my blog.

# Backend

This builds the stateful backend consisting of Lambda Function URLS with CORS enabledoperating on a single DynamoDB table.

## Build

Go to the infrastucture directory: **[{% include github-icon.html %} state-cdk]({{ site.github_urls.tree }}/state-cdk)**

```zsh
git clone git@github.com:StephenSmithwick/StephenSmithwick.github.io.git
cd state-cdk
```

To build the app:
- Install cdk library: `npm install -g aws-cdk`
- Install dependencies: `npm install`
- Build functions and CFN Template: `npm run build`

## Deploy
Login to aws (preferred approach [AWS SSO]({% post_url 2025-03-04-AWS-SSO %}))
Run `cdk deploy CommentsInterface` (or `CommentsStore`) to deploy / redeploy the Stack to your AWS Account.

After the deployment you will see the Dunctions URL which can then be used.


## CDK

Other useful CDK commands:

```bash
    $ cdk ls
    <list all stacks in this program>

    $ cdk synth
    <generates and outputs cloudformation template>

    $ cdk deploy
    <deploys stack to your account>

    $ cdk diff
    <shows diff against deployed stack>
```


## Interact via `curl`

### Create message
```zsh
curl -v $create -H 'content-type: application/json' \
-d '{ "user": "ssmithwick", "message": "test", "page": "/dev-desktop/User-Scripts.html" }'
```

### List messages
```zsh
curl -v $list -H 'content-type: application/json' \
-d '{ "page": "/dev-desktop/User-Scripts.html" }'
```

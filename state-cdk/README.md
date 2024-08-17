# Lamda Function URL with CORS and DynamoDB

This builds the stateful backend consisting of Lambda Function URLS with CORS enabledoperating on a single DynamoDB table.

## Build

To build the app:
- Install cdk library: `npm install -g aws-cdk`
- Install dependencies: `npm install`
- Build functions and CFN Template: `npm run build`

## Deploy

Run `cdk deploy` to deploy / redeploy the Stack to your AWS Account.

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
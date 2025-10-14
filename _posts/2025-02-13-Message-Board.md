---
layout: post
title: A Stateful Lambda CDK
plugins: [diff2html]
last_edit: 2025-03-17
published: true
categories: devops
needs-work: out-of-date
---

[//]: # (References)
[DynamoDB-FilterExpression]: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
[AWS-CDK-Lambda-Example]: https://github.com/aws-samples/aws-cdk-examples/tree/main/typescript/api-cors-lambda-crud-dynamodb
[will-it-cors]: https://httptoolkit.com/will-it-cors/preflight-response/

I set out to create a free tier, no privileged service to allow users to comment on my blog.

# Backend

This setup builds a stateful backend using Lambda Function URLs with CORS enabled operating on a single DynamoDB table.
I created the backend loosely based on the [AWS provided CDK Lamda Example][AWS-CDK-Lambda-Example].

## Build

Go to the infrastructure directory: **[{% include icons/github.html %} state-cdk]({{ site.playground_urls.tree }}/devops/state-cdk)**

```bash
git clone git@github.com:StephenSmithwick/playground
cd state-cdk
```

To build the app:
- Install cdk library: `npm install -g aws-cdk`
- Install dependencies: `npm install`
- Update dependencies: `npx npm-check-updates -u` (follow with `npm install`)
- Build functions and CFN Template: `npm run build`

## Deploy
Login to aws (preferred approach [AWS SSO]({% post_url 2025-03-04-AWS-SSO %}))
Run `cdk deploy --all --outputs-file comments.out.json --profile deployer` to deploy / redeploy the Stack to your AWS Account.
Note you can also deploy individual parts of the stack (from `cdk ls`):
- CommentsStore
- CommentsInterface

After the deployment you will see the Functions URL saved in [`comments.out.json`]({{ site.playground_urls.tree }}/devops/state-cdk/comments.out.json)

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

Define my function names based on the CDK output for use while testing:
```bash
eval $(jq -r '.CommentsInterface
    | to_entries
    | map("export \(.key)=\(.value)")
    | .[]' \
  comments.out.json
)
```

### Create message

```bash
curl -v $createMessageFunctionurl -H 'content-type: application/json' \
-d '{ "user": "ssmithwick", "message": "test", "page": "/dev-desktop/User-Scripts" }'
```

### List messages
```bash
curl $listMessagesFunctionurl -H 'content-type: application/json' \
-d '{ "page": "/dev-desktop/User-Scripts" }'
curl -v --request OPTIONS $list -H 'Origin: https://stephensmithwick.github.io' -H 'Access-Control-Request-Method: GET'
```

### Update message
```bash
curl $updateMessageFunctionurl -H 'content-type: application/json' \
-d '{ "message": "edited message", "page": "/dev-desktop/User-Scripts", "eventTime":"2025-03-13T23:32:11.074Z-k1rgS" }'
```

### Delete message
```bash
curl $deleteMessageFunctionurl -H 'content-type: application/json' \
-d '{ "page": "/dev-desktop/User-Scripts", "eventTime":"2025-03-14T14:24:45.843Z-G6NCo" }'
```

# Front End
For the following code snippets I've set the following constants in javascript:
```bash
jq -r '.CommentsInterface
    | to_entries
    | map("const \(.key)=\"\(.value)\";")
    | .[]' \
  comments.out.json
```

## Interact via javascript using console

### Debugging CORS
My initial CORS configuration was not sufficient and this is how I debugged the issue:
```typescript
  const lambdaUrl = lambdaFunction.addFunctionUrl({
    authType: lambda.FunctionUrlAuthType.NONE,
    cors: {
      allowedOrigins: ["https://stephensmithwick.github.io"],
    },
  });
```

When I checked the initial CORS configuration for my service endpoints it looked reasonable:
```bash
curl -v --request OPTIONS $list \
-H 'Origin: https://stephensmithwick.github.io' \
-H 'Access-Control-Request-Method: POST'
```

```
/* SNIP */
> OPTIONS / HTTP/1.1
> Host: 2b4x37j357c53sshz7jnsi5zty0ybojc.lambda-url.us-west-2.on.aws
> User-Agent: curl/8.7.1
> Accept: */*
> Origin: https://stephensmithwick.github.io
> Access-Control-Request-Method: POSTcurl
> Origin: https://stephensmithwick.github.io
> Access-Control-Request-Method: POST
>
/* SNIP */
< HTTP/1.1 200 OK
< Date: Fri, 14 Mar 2025 17:12:32 GMT
< Content-Type: application/json
< Content-Length: 0
< Connection: keep-alive
< x-amzn-RequestId: 788dbaff-878f-43ef-bcf7-1d68291ce99e
< Access-Control-Allow-Origin: https://stephensmithwick.github.io
< Vary: Origin
< Access-Control-Allow-Methods: *
```

However, when I made a fetch request from the console from
[stephensmithwick.github.io](https://stephensmithwick.github.io),
I encountered the following errors:

```javascript
fetch(list, {
  method: 'POST',
  headers: [['content-type', 'application/json']],
  body: JSON.stringify({ "page": "/dev-desktop/User-Scripts" })
}).then((response) => console.log(response))
```
I encountered the following errors:
- `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://2b4x37j357c53sshz7jnsi5zty0ybojc.lambda-url.us-west-2.on.aws/. (Reason: header ‘content-type’ is not allowed according to header ‘Access-Control-Allow-Headers’ from CORS preflight response).`
- `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://2b4x37j357c53sshz7jnsi5zty0ybojc.lambda-url.us-west-2.on.aws/. (Reason: CORS request did not succeed). Status code: (null).`

The error message clearly indicates that the `content-type` header is not allowed so I updated the header:
```diff
--- Function Url Definition
+++ Function Url Definition
@@ -1,6 +1,7 @@
   const lambdaUrl = lambdaFunction.addFunctionUrl({
     authType: lambda.FunctionUrlAuthType.NONE,
     cors: {
       allowedOrigins: [https://stephensmithwick.github.io],
+      allowedHeaders: [content-type],
     },
   });
```

This change will give change the CORS response from the endpoints:
```diff
--- CORS response
+++ CORS response
@@ -1,9 +1,10 @@
 HTTP/1.1 200 OK
-Date: Fri, 14 Mar 2025 17:12:32 GMT
+Date: Fri, 14 Mar 2025 17:34:03 GMT
 Content-Type: application/json
 Content-Length: 0
 Connection: keep-alive
-x-amzn-RequestId: 788dbaff-878f-43ef-bcf7-1d68291ce99e
+x-amzn-RequestId: 719e4aa7-3741-41f6-b884-014562ae4717
 Access-Control-Allow-Origin: https://stephensmithwick.github.io
+Access-Control-Allow-Headers: content-type
 Vary: Origin
 Access-Control-Allow-Methods: *
```

By explicitly allowing the ‘content-type’ header in the CORS configuration, the issue was resolved, and the request will succeeded from the site.

# Work to Do
- [x] Configure AWS SSO account to interact with service:[setup AWS SSO]({% post_url 2025-03-04-AWS-SSO %})
- [x] Setup hosted backend in AWS using CDK: **[state-cdk]({{ site.playground_urls.tree }}/devops/state-cdk)**
- [x] Setup CORS
- [ ] Integrate with website
- [ ] Creation of Unit Tests for lambda functions
- [ ] Support for local integration testing (See LocalStack)
- [ ] Harden the service

# Security Considerations

## Lambda Function URL Security
  - I am using authType: NONE, which makes the API completely open as intended but some precations such as rate limiting implemented through.
  - Cross-Origin Resource Sharing (CORS): CORS does not provide any real security against malicious clients ane merely limits well behaving clients to access the service from this blog.

## DynamoDB Security
  - Access to all of the data is open to anyone who can use the API.

## Monitoring and Auditing
  - We log to CloudWatch on any modification to the Data in DynamoDB and any errors encountered which provides some visibility of the system over time.

By implementing these security measures, you can enhance the protection of your serverless comment system against potential threats and ensure compliance with best practices.

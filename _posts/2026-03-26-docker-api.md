---
layout: post
title:  An Exploration of Docker Socket API
categories: devops
published: true
# last_edit:
---

[//]: # (Docker)


[//]: # (Colima)


This is an exploration of the docker api used by your local Docker CLI client. While most developers interact with Docker through the CLI, the client communicates with your local Docker instance over a Unix socket. Bypassing the CLI and talking directly to the Docker Engine API via curl can help you understand how things work and who knows, may be useful for building custom monitoring tools.

## Retrieving the unix socket path

To retrieve your docker socket path you can ask the client for you local context details:

```bash
export DOCKER_SOCKET=$(docker context inspect -f json | jq -r '.[].Endpoints.docker.Host' | sed 's|unix://||')
```

broken down:

`docker context inspect -f json` | `jq -r '.[].Endpoints.docker.Host` | `sed 's|unix://||'`
-|-|-
The docker contexts including socket endpoints | jq selects the path to the docker unix socket | strip off the unix protocol specifier to leave the local socket path



## Retrieving unix socket path with Colima

I use Colima as my docker host and can use `colima status` to retrieve more information about the setup:

```bash
export DOCKER_SOCKET=$(colima status --json | jq -r '.docker_socket' | sed 's|unix://||')
```

`colima status` returns the `driver`, `arch`, `ip_address`, `docker_socket`, `containerd_socket`, dedicated memory and cpu, and kubernetes details.

## Exploring the docker API

Now that we have the socket we can start exploring the API.

### Images

```bash
curl --unix-socket $DOCKER_SOCKET http://docker/images/json | jq
```

```json
[
  {
    "Containers": 0,
    "Created": 1770235753,
    "Id": "sha256:"/*--SNIPPED--*/,
    "Labels": null,
    "ParentId": "",
    "Descriptor": {
      "mediaType": "application/vnd.oci.image.index.v1+json",
      "digest": "sha256:"/*--SNIPPED--*/,
      "size": 10293
    },
    "RepoDigests": [
      "python@sha256:"/*--SNIPPED--*/
    ],
    "RepoTags": [
      "python:3-alpine"
    ],
    "SharedSize": -1,
    "Size": 76498131
  },
  {
    "Containers": 1,
    "Created": 1766096607,
    "Id": "sha256:"/*--SNIPPED--*/,
    "Labels": {
      "manymine.enable": "true",
      /*--SNIPPED--*/
      "org.opencontainers.image.version": "master"
    },
    "ParentId": "",
    "Descriptor": {
      "mediaType": "application/vnd.docker.distribution.manifest.list.v2+json",
      "digest": "sha256:"/*--SNIPPED--*/,
      "size": 685
    },
    "RepoDigests": [
      "itzg/minecraft-bedrock-server@sha256:"/*--SNIPPED--*/
    ],
    "RepoTags": [
      "itzg/minecraft-bedrock-server:latest"
    ],
    "SharedSize": -1,
    "Size": 454288179
  }
]
```


### Containers

```bash
docker container start mc-server
curl --unix-socket $DOCKER_SOCKET http://docker/containers/json | jq
```

```json
[
  {
    "Id": "ff3eceaf7f730b34931c9d2c1ceef919ca556920254bee3984837ae5e8fa67f5",
    "Names": [
      "/mc-server"
    ],
    "Image": "itzg/minecraft-bedrock-server",
    "ImageID": "sha256:"/*--SNIPPED--*/,
    "ImageManifestDescriptor": {
      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
      "digest": "sha256:"/*--SNIPPED--*/,
      "size": 3061,
      "platform": {
        "architecture": "arm64",
        "os": "linux"
      }
    },
    "Command": "/usr/local/bin/entrypoint-demoter --match /data --debug --stdin-on-term stop /opt/bedrock-entry.sh",
    "Created": 1771273266,
    "Ports": [],
    "Labels": {
      "manymine.enable": "true",
      /*--SNIPPED--*/
      "org.opencontainers.image.version": "master"
    },
    "State": "running",
    "Status": "Up 12 seconds (health: starting)",
    "HostConfig": {
      "NetworkMode": "host"
    },
    "NetworkSettings": {
      "Networks": {
        "host": {
          /*--SNIPPED--*/
        }
      }
    },
    "Mounts": [
      {
        "Type": "volume",
        "Name": "mc-volume",
        /*--SNIPPED--*/
      }
    ]
  }
]
```

## Next Steps or where I might go from here
I found it facsinating to explore the docker client protocol.  With further exploration using the exposed docker socket we can interact with docker using our own tools.  For instance, I am working on a agentic agent framework which uses docker instances as a way to isolate it's work from the host system.  We should be able to use this API to monitor work started by the agent.

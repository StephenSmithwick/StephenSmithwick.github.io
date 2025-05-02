---
layout: post
title: Kubernetes
# last_edit:
published: false
categories: devops
---

Kubernetes(k8s) is a container orchestration system initially built by google and inspired by their internal [Borg](https://kubernetes.io/blog/2015/04/borg-predecessor-to-kubernetes/).

To get started with k8s development, you can use Minikube.

# Working with [Minkube](https://minikube.sigs.k8s.io/docs/) to test

Minikube is a lightweight k8s implementation that creates a VM on your local machine and deploys a simple cluster containing only one node. Minikube is available for Linux, macOS, and Windows systems.

## Prerequisites
You need a container service.  Docker should probably be your default.

Installing Docker: https://docs.docker.com/desktop/setup/install/mac-install/

## Commands
The Minikube CLI provides basic bootstrapping operations for working with your cluster:

start minikube
: `minikube start`

using minikube's kubectl
: `alias kubectl="minikube kubectl --"`

dashboard
: `minikube dashboard`

<!--
start
stop
status
delete
-->

# [Cluster](https://kubernetes.io/docs/tutorials/hello-minikube/)
Kubernetes coordinates a highly available cluster of computers that are connected to work as a single unit. The abstractions in Kubernetes allow you to deploy containerized applications to a cluster without tying them specifically to individual machines. To make use of this new model of deployment, applications need to be packaged in a way that decouples them from individual hosts: they need to be containerized. Containerized applications are more flexible and available than in past deployment models, where applications were installed directly onto specific machines as packages deeply integrated into the host. Kubernetes automates the distribution and scheduling of application containers across a cluster in a more efficient way. Kubernetes is an open-source platform and is production-ready.

A k8s cluster consists of two types of resources:

## Control Plane - coordinates the cluster
The Control Plane manages the cluster and coordinates all activities such as scheduling and maintaining applications: desired state, scale, and updates.

## Nodes - workers that run applications
A node is the worker machine in a k8s cluster. Each node has a [Kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/) for managing the node and communicating with the Kubernetes control plane.

The node has tools for handling container operations like [containerd](https://containerd.io/) or [CRI-O](https://cri-o.io/).

A production cluster should have a minimum of three nodes because if both [etcd](https://etcd.io/) and the control plane instance are lost: redundancy is compromised.

When you deploy an applications: the control plane starts the application containers and schedules the containers to run on the cluster's nodes.
Node-level components, like kubelet, communicate with the control plane using the k8s API exposed by the control.
End users can use the k8s API directly to interact with the cluster.

## kubectl
### Deployment
```bash
kubectl create deployment hello-node \
    --image=registry.k8s.io/e2e-test-images/agnhost:2.39 \
    -- /agnhost netexec --http-port=8080
```
![Kubernetes Dashboard](/post_images/Kubernetes-Dashboard.png)

- `kubectl get deployments`
- `kubectl get pods`

### Service
In order to expose a pod and make it a service you will need to expose the deployment:
```bash
kubectl expose deployment hello-node \
    --type=LoadBalancer --port=8080
```

`kubectl get services`

```
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
hello-node   LoadBalancer   10.102.77.214   <pending>     8080:32215/TCP   8m28s
kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          20h
```

`minikube service hello-node` - opens a tunnel to the service so we can view the exposed endpoint locally

```
|-----------|------------|-------------|---------------------------|
| NAMESPACE |    NAME    | TARGET PORT |            URL            |
|-----------|------------|-------------|---------------------------|
| default   | hello-node |        8080 | http://192.168.49.2:32215 |
|-----------|------------|-------------|---------------------------|
🏃  Starting tunnel for service hello-node.
|-----------|------------|-------------|------------------------|
| NAMESPACE |    NAME    | TARGET PORT |          URL           |
|-----------|------------|-------------|------------------------|
| default   | hello-node |             | http://127.0.0.1:52495 |
|-----------|------------|-------------|------------------------|
🎉  Opening service default/hello-node in default browser...
```

---

# Alternative to Docker and minikube (podman and k3d)
You need a container service.  Docker should probably be your default but
I've been playing with [podman](https://podman.io/) because it offers rootless alternative to docker which is largely drop-in compatible.

Installing podman
- `brew install podman`
- `podman machine init`
- `podman machine start`


## Working locally with [k3d](https://kind.sigs.k8s.io/)
see: https://k3d.io/v5.5.1/usage/advanced/podman/#macos

`podman system connection ls`

### Create a cluster
```bash
export DOCKER_HOST=ssh://root@localhost:53685
export DOCKER_SOCK=/run/podman/podman.sock
```

Setup podman network {% raw %}
```bash
podman network create k3d
podman network inspect k3d -f '{{ .DNSEnabled }}'
```
{% endraw %}

---
layout: post
title: Kubernetes
# last_edit:
published: true
categories: devops
meta: WiP
---

Kubernetes(k8s) is a container orchestration system initially built by google and inspired by their internal [Borg](https://kubernetes.io/blog/2015/04/borg-predecessor-to-kubernetes/).

To get started with k8s development, we will use Minikube.

# Working with [Minkube](https://minikube.sigs.k8s.io/docs/) to test

Minikube is a lightweight k8s implementation that creates a local cluster with a simple one node cluster.

## Prerequisites
You need a container service.  You can use Docker or Colima as a light weight alternative

Installing Docker on OSX mostly uses the traditioanal app install: [Docker Mac Install](https://docs.docker.com/desktop/setup/install/mac-install/)

Installing Colima is easy with your typical OSX package managers: [Colima Mac Install](https://github.com/abiosoft/colima?tab=readme-ov-file#installation)

```bash
brew install Colima
colima start --kubernetes
```

### Useful colima commands

`colima start`
: starts colima.  Useful Options: `--cpu`, `--memory` (GBs), `--disk` (GBs), `--arch` (deafult: aarch64), `--kubernetes`

`colima list`
: List all colima profiles

`colima ssh -p [default]`
: SSH into the the colima container matching the profile(`-p` default: `default`)

## Commands
The Minikube CLI provides basic bootstrapping operations for working with your cluster:

`minikube start`
: start minikube

`alias kubectl="minikube kubectl --"`
: You can use minikube's kubectl for guaranteed compatibility

`minikube dashboard`
: bring up a dashboard displaying the status of your minikube cluster in a web browser

`minikube status`
: Show the the status of minkube in thwe CLI

<!--
stop
status
delete
-->

# [Cluster](https://kubernetes.io/docs/tutorials/hello-minikube/)
Kubernetes coordinates a highly available cluster of servers. Kubernetes allows you to deploy containerized applications to the cluster without tying them specifically to individual server. Applications will need to be packaged in a container (Docker). Kubernetes automates the distribution and scheduling of application containers across a cluster.

A k8s cluster consists of two types of resources:

## Control Plane - coordinates the cluster
The Control Plane manages the cluster and coordinates all activities such as scheduling and maintaining applications: desired state, scale, and updates.

## Nodes - workers that run applications
A node is the worker machine in a k8s cluster. Each node has a [Kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/) for managing the node and communicating with the Kubernetes control plane.

The node has tools for handling container operations like [containerd](https://containerd.io/) or [CRI-O](https://cri-o.io/).

A production cluster should have a minimum of three nodes to maintain redundancy of [etcd](https://etcd.io/) and the control plane.

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
- `pod=$(kubectl get pods --no-headers -o custom-columns=":metadata.name" | grep "hello-node" | head -n 1)`
- `kubectl get events`
- `kubectl config view`
- `kubectl logs $pod`


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


start minikube
: `minikube start`

dashboard
: `minikube dashboard`


# Alternative to Docker and minikube (podman and k3d)
## Resources
- [Using Podman instead of Docker](https://k3d.io/v5.5.1/usage/advanced/podman/#macos)

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



# Alternatives

k0S
: [k0sproject.io](https://k0sproject.io/) - k0s is the simple, solid & certified Kubernetes distribution that works on any infrastructure: bare-metal, on-premises, edge, IoT, public & private clouds. It's 100% open source & free.

K3S
: [k3s.io](https://k3s.io/) - Lightweight Kubernetes built for IoT & Edge computing - Rancher

MicroK8s
: [microk8s](https://microk8s.io/) - Zero-ops, pure-upstream, HA Kubernetes, from developer workstations to production



[minikube-on-a-mac]: https://medium.com/@architchandra/how-to-install-minikube-on-a-mac-33bb2626623
[podman-on-osx]: https://bharatrajagopalan.medium.com/experimenting-with-alternatives-for-docker-podman-on-mac-os-big-sur-with-vmware-fusion-3d9f21dbcf65
[ducker]: https://github.com/robertpsoane/ducker
[docker-to-colima]: https://medium.com/@ttofisandreas/how-i-transitioned-from-docker-desktop-to-colima-015bd70aa461

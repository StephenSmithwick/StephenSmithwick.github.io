---
layout: post
title: Local Kubernetes
# last_edit:
published: true
categories: devops
---

Docker and Kubernetes are fairly mature and now have many alternative implementations that you can run localy.  Some alternatives are explored below.

## Minikube and Colima
<small>[Minikube](https://minikube.sigs.k8s.io/docs/) - [Colima](https://github.com/abiosoft/colima)</small>

Minikube is a lightweight k8s implementation that creates a local cluster with a simple one node cluster.

## Prerequisites
You need a container service.  You can use Docker or Colima as a light weight alternative

Installing Colima is easy with your typical OSX package managers: [Colima Mac Install](https://github.com/abiosoft/colima?tab=readme-ov-file#installation)

```bash
brew install Colima
colima start --kubernetes
```

### Useful commands

`colima start`
: starts colima.  Useful Options: `--cpu`, `--memory` (GBs), `--disk` (GBs), `--arch` (deafult: aarch64), `--kubernetes`

`colima list`
: List all colima profiles

`colima ssh -p [default]`
: SSH into the the colima container matching the profile(`-p` default: `default`)

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

## Podman and K3D
- [Using Podman instead of Docker](https://k3d.io/v5.5.1/usage/advanced/podman/#macos)

You need a container service.  Docker should probably be your default but
I've been playing with [podman](https://podman.io/) because it offers rootless alternative to docker which is largely drop-in compatible.

Installing podman
- `brew install podman`
- `podman machine init`
- `podman machine start`


### Working locally with [k3d](https://kind.sigs.k8s.io/)
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

## k0S
[k0sproject.io](https://k0sproject.io/)
k0s is the simple, solid & certified Kubernetes distribution that works on any infrastructure: bare-metal, on-premises, edge, IoT, public & private clouds. It's 100% open source & free.

## K3S
[k3s.io](https://k3s.io/)
Lightweight Kubernetes built for IoT & Edge computing - Rancher

## MicroK8s
[microk8s](https://microk8s.io/)
Zero-ops, pure-upstream, HA Kubernetes, from developer workstations to production


# Further reading
- [minikube-on-a-mac](https://medium.com/@architchandra/how-to-install-minikube-on-a-mac-33bb2626623)
- [podman-on-osx](https://bharatrajagopalan.medium.com/experimenting-with-alternatives-for-docker-podman-on-mac-os-big-sur-with-vmware-fusion-3d9f21dbcf65)
- [ducker](https://github.com/robertpsoane/ducker)
- [docker-to-colima](https://medium.com/@ttofisandreas/how-i-transitioned-from-docker-desktop-to-colima-015bd70aa461)

---
layout: post
title: Stateful Kubernetes Service
# last_edit:
published: true
categories: devops
meta: WiP
---

Kubernetes(k8s) is a container orchestration system initially built by google and inspired by their internal [Borg](https://kubernetes.io/blog/2015/04/borg-predecessor-to-kubernetes/). With k8s support in all of the major cloud providers, it is the most universal way to run your service in the cloud.

It has been a longstanding idea that you should not host your database in k8s:
- [Kelsey Hightower: Avoid Data Disasters with Kubernetes](https://www.youtube.com/watch?v=9uyNiAFmWqw)

This post is not a recomendation of if we should persist data in a kubernetes service, but is an exploration of persistent data in kubernetes.
To test our ideas on persistent data we will we will use Minikube.

# [Clusters](https://kubernetes.io/docs/tutorials/hello-minikube/)
Kubernetes coordinates a highly available cluster of servers and allows you to deploy containerized applications to the cluster without tying them specifically to an individual server. Applications need to be packaged in a container (Docker). Kubernetes automates the distribution and scheduling of application containers across a cluster.

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

## Deployments
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


### Services
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

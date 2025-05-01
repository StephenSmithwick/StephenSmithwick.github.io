---
layout: post
title: Kubernettes
# last_edit:
published: false
categories: devops
---

Kubernettes is a container orchestration system initially built by google and inspired by their internal [Borg](https://kubernetes.io/blog/2015/04/borg-predecessor-to-kubernetes/).

# [Kubernetes Cluster?](https://kubernetes.io/docs/tutorials/hello-minikube/)
Kubernetes coordinates a highly available cluster of computers that are connected to work as a single unit. The abstractions in Kubernetes allow you to deploy containerized applications to a cluster without tying them specifically to individual machines. To make use of this new model of deployment, applications need to be packaged in a way that decouples them from individual hosts: they need to be containerized. Containerized applications are more flexible and available than in past deployment models, where applications were installed directly onto specific machines as packages deeply integrated into the host. Kubernetes automates the distribution and scheduling of application containers across a cluster in a more efficient way. Kubernetes is an open-source platform and is production-ready.

A Kubernetes cluster consists of two types of resources:

## 1. Control Plane - coordinates the cluster
The Control Plane manages the cluster and coordinates all activities such as scheduling and maintaining applications: desired state, scale, and updates.

## 2. Nodes - workers that run applications
A node is the worker machine in a Kubernetes cluster. Each node has a Kubelet for managing the node and communicating with the Kubernetes control plane.

The node has tools for handling container operations, such as containerd or CRI-O. A production cluster should have a minimum of three nodes because both an etcd member and a control plane instance are lost, and redundancy is compromised.

When you deploy applications on Kubernetes, you tell the control plane to start the application containers. The control plane schedules the containers to run on the cluster's nodes. Node-level components, such as the kubelet, communicate with the control plane using the Kubernetes API, which the control plane exposes. End users can also use the Kubernetes API directly to interact with the cluster.

A Kubernetes cluster can be deployed on either physical or virtual machines. To get started with Kubernetes development, you can use Minikube. Minikube is a lightweight Kubernetes implementation that creates a VM on your local machine and deploys a simple cluster containing only one node. Minikube is available for Linux, macOS, and Windows systems. The Minikube CLI provides basic bootstrapping operations for working with your cluster, including start, stop, status, and delete.



# Working with Minkube to test
start minikube
: `minikube start`

using minikube's kubectl
: `alias kubectl="minikube kubectl --"`

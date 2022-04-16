# Infrastructure

Defines shared infrastructure resources and services, using Pulumi.

The structure of this repository is heavily inspired by [Pulumi's Crosswalk for Kubernetes Playbook](https://www.pulumi.com/docs/guides/crosswalk/kubernetes/playbooks/).

## Environments

There are two environments, corresponding to Pulumi stacks:

- `production`
- `next`

These should also be used to define any cloud provider's native form of resource management, such as Resource Groups in Azure.

## Resources

We run the bulk of our resources on Azure. Resources are colocated when this makes sense, e.g. network, storage, identity resources relating to the AKS cluster will all be in the same folder.

### Identity

### Cluster

The `aks`

## Deployment

Once a pull request has been

# Infrastructure

Infrastructure-as-code definitions of shared infrastructure resources and services, using Pulumi.

The structure of this repository is heavily inspired by [Pulumi's Crosswalk for Kubernetes Playbook](https://www.pulumi.com/docs/guides/crosswalk/kubernetes/playbooks/).

## Resources

We run the bulk of our resources on Azure. Resources are colocated when this makes sense, e.g. network, storage, identity resources relating to the AKS cluster will all be in the same folder.

## Tools

Tools are resources that are shared across all environments, such as code signing certicates and more. These are defined in the `tools` folder.

## Environments

There are two environments, corresponding to Pulumi stacks. Every change will be deployed to the `next` environment, and once approved, will be deployed to the `production` environment.

- `production`
- `next`

These should also be used to define any cloud provider's native form of resource management, such as Resource Groups in Azure.

### Identity

This folder exports shared identity resources around service principals, environment applications, and resource groups.

### Network

Networking resources such as shared virtual networks, subnets, and assignments are defined here.

### Logging

Logging Analytics workspace for Azure and any other logging setup resources.

### Cluster

The kubernetes cluster for the environment is defined here. This module also exports a reusable kubeconfig and provider.

### Cluster Applications

Shared workloads and applications that sit on the kubernetes cluster are defined here, such as Ingress controllers.

## GitHub Secrets

Any additional GitHub secrets that are derived from the shared resources above are declared in this module, for example, the kubeconfig for cluster access.

## Deployment

Once a pull request has been opened, `pulumi preview` is run and the output is posted as a comment back onto the PR.

On merge, changes to the `next` environment are automatically deployed, and the `production` environment is only deployed once the environment approvers give the thumbs up on the workflow UI.

## Initial Setup

Some one-time setup needs to be done to provide GitHub Action jobs with secrets that allow it to carry out changes.

### Azure

1. Create an Azure Service Principal with ID of the desired subscription:
   `az ad sp create-for-rbac --name "github-app" --role contributor --scopes /subscriptions/{SubscriptionID}`. The values that are outputted should be added to [GitHub Action secrets](https://www.pulumi.com/registry/packages/azure-native/installation-configuration/)
2. Grant it API permission access to: Microsoft Graph `Application.ReadWriteAll` - this can be done via `Azure Portal` > `App Registrations` > `All applications` > `github-app` > `API permissions` > `Add a permission`
3. Grant admin consent for Shabad OS

## Troubleshooting

### Client keys expired in CI

You'll see an error like this: `The provided client secret keys for app '***' are expired. Visit the Azure portal to create new keys for your app: https://aka.ms/NewClientSecret...`.

This means that the Azure App Registration client secret has expired. To fix this:

1. Retrieve the Azure App ID with the CLI: `az ad app list --display-name github-app --query "[].{AppID:appId}" -o tsv`
1. Reset the client secret with the CLI: `az ad app credential reset --id {AppID}`
1. Update the organisation's `ARM_CLIENT_SECRET` secret in GitHub with the new value

import { listManagedClusterUserCredentialsOutput, ManagedCluster } from '@pulumi/azure-native/containerservice'
import { Provider } from '@pulumi/kubernetes'

import identity from '../shared/identity'
import logging from './logging'
import network from './network'

type Options = {
  identity: Awaited<ReturnType<typeof identity>>,
  network: Awaited<ReturnType<typeof network>>,
  logging: Awaited<ReturnType<typeof logging>>,
}

const clusterModule = async ( {
  identity: { application, resourceGroup, servicePrincipalPassword },
  network: { subnet },
  logging: { logAnalyticsWorkspace },
}: Options ) => {
  const cluster = new ManagedCluster( 'cluster', {
    resourceGroupName: resourceGroup.name,
    kubernetesVersion: '',
    agentPoolProfiles: [ {
      name: 'default',
      mode: 'System',
      count: 1,
      vmSize: 'Standard_F2s_v2',
      vnetSubnetID: subnet.id,
    } ],
    dnsPrefix: resourceGroup.name,
    enableRBAC: true,
    servicePrincipalProfile: {
      clientId: application.applicationId,
      secret: servicePrincipalPassword.value,
    },
    networkProfile: {
      networkPlugin: 'azure',
      serviceCidr: '10.10.0.0/16',
      dnsServiceIP: '10.10.0.10',
    },
    addonProfiles: {
      omsagent: {
        enabled: true,
        config: {
          logAnalyticsWorkspaceResourceID: logAnalyticsWorkspace.id,
        },
      },
    },
  } )

  const kubeconfig = listManagedClusterUserCredentialsOutput( {
    resourceName: cluster.name,
    resourceGroupName: resourceGroup.name,
  } ).apply( ( { kubeconfigs } ) => Buffer.from( kubeconfigs[ 0 ].value, 'base64' ).toString() )

  const provider = new Provider( 'kubernetes-provider', { kubeconfig } )

  return { cluster, kubeconfig, provider }
}

export default clusterModule

import { listManagedClusterUserCredentialsOutput, ManagedCluster } from '@pulumi/azure-native/containerservice'

import * as environment from '../helpers/environment'
import identity from '../identity'
import network from '../network'

type Options = {
  identity: Awaited<ReturnType<typeof identity>>,
  network: Awaited<ReturnType<typeof network>>,
}

export = async ( {
  identity: { application, resourceGroup, servicePrincipalPassword },
  network: { subnet },
}: Options ) => {
  const cluster = new ManagedCluster( `${environment.name}-cluster`, {
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
      clientId: application.id,
      secret: servicePrincipalPassword.value,
    },
  } )

  const kubeconfig = listManagedClusterUserCredentialsOutput( {
    resourceName: cluster.name,
    resourceGroupName: resourceGroup.name,
  } ).apply( ( { kubeconfigs } ) => Buffer.from( kubeconfigs[ 0 ].value, 'base64' ).toString() )

  return { cluster, kubeconfig }
}

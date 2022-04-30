import { PrincipalType, RoleAssignment } from '@pulumi/azure-native/authorization'
import { Subnet, VirtualNetwork } from '@pulumi/azure-native/network'

import azure from '../helpers/azure'
import identity from '../identity'

type Options = {
  azure: Awaited<ReturnType<typeof azure>>,
  identity: Awaited<ReturnType<typeof identity>>,
}

export = async ( {
  azure: { subscriptionId },
  identity: { resourceGroup, servicePrincipal },
}: Options ) => {
  const virtualNetwork = new VirtualNetwork( 'virtual-network', {
    resourceGroupName: resourceGroup.name,
    addressSpace: { addressPrefixes: [ '10.0.0.0/16' ] },
  } )

  const subnet = new Subnet( 'subnet', {
    resourceGroupName: resourceGroup.name,
    virtualNetworkName: virtualNetwork.name,
    addressPrefix: '10.0.0.0/24',
  } )

  const subnetAssignment = new RoleAssignment( 'subnet-permissions', {
    principalId: servicePrincipal.id,
    principalType: PrincipalType.ServicePrincipal,
    scope: subnet.id,
    roleDefinitionId: `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/4d97b98b-1d4f-4787-a291-c67834d212e7`,
  } )

  return { virtualNetwork, subnet, subnetAssignment }
}

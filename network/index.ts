import { PrincipalType, RoleAssignment } from '@pulumi/azure-native/authorization'
import { Subnet, VirtualNetwork } from '@pulumi/azure-native/network'

import azure from '../helpers/azure'
import * as environment from '../helpers/environment'
import identity from '../identity'

type Options = {
  azure: Awaited<ReturnType<typeof azure>>,
  identity: Awaited<ReturnType<typeof identity>>,
}

export = async ( {
  azure: { subscriptionId },
  identity: { resourceGroup, servicePrincipal },
}: Options ) => {
  const addressPrefix = '10.0.0.0/16'

  const virtualNetwork = new VirtualNetwork( `${environment.name}-virtual-network`, {
    resourceGroupName: resourceGroup.name,
    addressSpace: {
      addressPrefixes: [ addressPrefix ],
    },
  } )

  const subnet = new Subnet( `${environment.name}-subnet`, {
    resourceGroupName: resourceGroup.name,
    virtualNetworkName: virtualNetwork.name,
    addressPrefix,
  } )

  const subnetAssignment = new RoleAssignment( `${environment.name}-subnet-permissions`, {
    principalId: servicePrincipal.id,
    principalType: PrincipalType.ServicePrincipal,
    scope: subnet.id,
    roleDefinitionId: `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/4d97b98b-1d4f-4787-a291-c67834d212e7`,
  } )

  return { virtualNetwork, subnet, subnetAssignment }
}

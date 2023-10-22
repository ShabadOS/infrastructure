import { authorization } from '@pulumi/azure-native'

import identity from '../shared/identity'

type Options = {
  identity: Awaited<ReturnType<typeof identity>>,
}

const iamModule = async ( {
  identity,
}: Options ) => {
  new authorization.RoleAssignment( 'azure-sp-role-assignment', {
    principalId: identity.servicePrincipal.id,
    principalType: authorization.PrincipalType.ServicePrincipal,
    roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7',
    scope: identity.resourceGroup.id,
  } )
}

export default iamModule

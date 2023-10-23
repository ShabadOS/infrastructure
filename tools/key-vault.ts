import { authorization, keyvault } from '@pulumi/azure-native'

import azure from '../shared/azure'
import identity from '../shared/identity'

type Options = {
  azure: Awaited<ReturnType<typeof azure>>,
  identity: Awaited<ReturnType<typeof identity>>,
}

const keyVaultModule = async ( {
  azure: { tenantId },
  identity: { resourceGroup, servicePrincipal },
}: Options ) => {
  const vault = new keyvault.Vault( 'shabad-os-tools', {
    vaultName: 'shabad-os-tools',
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    properties: {
      sku: { name: keyvault.SkuName.Premium, family: keyvault.SkuFamily.A },
      tenantId,
      enablePurgeProtection: true,
      enableSoftDelete: true,
      publicNetworkAccess: keyvault.PublicNetworkAccess.Enabled,
      accessPolicies: [ {
        tenantId,
        objectId: servicePrincipal.id,
        permissions: {
          certificates: [
            keyvault.CertificatePermissions.Get,
            keyvault.CertificatePermissions.List,
          ],
          keys: [
            keyvault.KeyPermissions.Get,
            keyvault.KeyPermissions.List,
            keyvault.KeyPermissions.Sign,
          ],
          secrets: [ keyvault.SecretPermissions.Get, keyvault.SecretPermissions.List ],
        },
      } ],
    },
  }, { protect: true } )

  new authorization.RoleAssignment( 'azure-sp-key-vault-role-assignment', {
    principalId: servicePrincipal.id,
    principalType: authorization.PrincipalType.ServicePrincipal,
    roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/4633458b-17de-408a-b874-0445c86b69e6',
    scope: vault.id,
  } )

  return vault
}

export default keyVaultModule

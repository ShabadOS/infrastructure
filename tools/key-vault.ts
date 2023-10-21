import { keyvault } from '@pulumi/azure-native'

import azure from '../shared/azure'
import identity from '../shared/identity'

type Options = {
  azure: Awaited<ReturnType<typeof azure>>,
  identity: Awaited<ReturnType<typeof identity>>,
}

const keyVaultModule = async ( {
  azure: { tenantId },
  identity: { resourceGroup, servicePrincipal },
}: Options) => new keyvault.Vault('shabad-os-tools', {
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
        certificates: [ keyvault.CertificatePermissions.Get, keyvault.CertificatePermissions.List ],
        keys: [ keyvault.KeyPermissions.Get, keyvault.KeyPermissions.List ],
        secrets: [ keyvault.SecretPermissions.Get, keyvault.SecretPermissions.List ],
      },
    } ],
  },
} )

export default keyVaultModule

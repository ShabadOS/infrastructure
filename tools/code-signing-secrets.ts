import { ActionsOrganizationSecret } from '@pulumi/github'
import { Output } from '@pulumi/pulumi'

import identity from '../shared/identity'
import keyVault from './key-vault'

type Options = {
  identity: Awaited<ReturnType<typeof identity>>,
  keyVault: Awaited<ReturnType<typeof keyVault>>,
}

const codeSigningSecretsModule = async ( {
  identity: { application, servicePrincipalPassword },
  keyVault,
}: Options ) => ( [
  [ 'url', 'URL', keyVault.properties.vaultUri ],
  [ 'application-id', 'APPLICATION_ID', application.applicationId ],
  [ 'client-secret', 'CLIENT_SECRET', servicePrincipalPassword.value ],
] as const ).map( ( [
  name,
  secretName,
  value,
] ) => new ActionsOrganizationSecret( `azure-key-vault-${name}-github-secret`, {
  secretName: `AZURE_KEY_VAULT_${secretName}`,
  visibility: 'all',
  plaintextValue: value as Output<string>,
} ) )

export default codeSigningSecretsModule

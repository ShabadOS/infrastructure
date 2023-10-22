import { ActionsOrganizationSecret } from '@pulumi/github'
import { Output } from '@pulumi/pulumi'

import keyVault from './key-vault'

type Options = {
  keyVault: Awaited<ReturnType<typeof keyVault>>,
}

const codeSigningSecretsModule = async ( {
  keyVault,
}: Options ) => ( [
  [ 'url', 'URL', keyVault.properties.vaultUri ],
  [ 'certificate-name', 'CERTIFICATE_NAME', 'EV-CodeSigning' ],
  [ 'timestamp-url', 'TIMESTAMP_URL', 'http://timestamp.digicert.com' ],
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

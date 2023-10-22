import azureModule from '../shared/azure'
import identityModule from '../shared/identity'
import azureSecretsModule from './azure-secrets'
import codeSigningSecretsModule from './code-signing-secrets'
import iamModule from './iam'
import keyVaultModule from './key-vault'

const stack = async () => {
  const azure = await azureModule()

  const identity = await identityModule()
  await iamModule( { identity } )

  const keyVault = await keyVaultModule( { azure, identity } )

  await codeSigningSecretsModule( { keyVault } )
  await azureSecretsModule( { azure, identity } )
}

export = stack

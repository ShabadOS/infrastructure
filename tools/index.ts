import azureModule from '../shared/azure'
import identityModule from '../shared/identity'
import codeSigningSecretsModule from './code-signing-secrets'
import keyVaultModule from './key-vault'

const stack = async () => {
  const azure = await azureModule()

  const identity = await identityModule()

  const keyVault = await keyVaultModule( { azure, identity } )
  await codeSigningSecretsModule( { keyVault, identity } )
}

export = stack

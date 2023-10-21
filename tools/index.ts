import azureModule from '../shared/azure'
import identityModule from '../shared/identity'
import keyVaultModule from './key-vault'

const stack = async () => {
  const azure = await azureModule()

  const identity = await identityModule()

  const keyVault = await keyVaultModule( { azure, identity } )

  return {
    azureSignTool: {
      keyVaultUri: keyVault.location,
      keyVaultClientId: identity.application.applicationId,
      keyVaultClientSecret: identity.servicePrincipalPassword.value,
      keyVaultCertificateName: 'EV-CodeSigning',
    },
  }
}

export = stack

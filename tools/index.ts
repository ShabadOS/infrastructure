import azureModule from '~/shared/azure'
import identityModule from '~/shared/identity'

import keyVaultModule from './key-vault'

export = async () => {
  const azure = await azureModule()

  const identity = await identityModule()

  await keyVaultModule( { azure, identity } )
}

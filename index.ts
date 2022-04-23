import azureModule from './helpers/azure'
import identityModule from './identity'
import networkModule from './network'

export = async () => {
  const azure = await azureModule()
  const identity = await identityModule()
  await networkModule( { azure, identity } )
}

import clusterModule from './cluster'
import azureModule from './helpers/azure'
import identityModule from './identity'
import networkModule from './network'

export = async () => {
  const azure = await azureModule()
  const identity = await identityModule()
  const network = await networkModule( { azure, identity } )
  await clusterModule( { identity, network } )
}

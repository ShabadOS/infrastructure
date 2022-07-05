import clusterModule from './cluster'
import clusterApplications from './cluster-applications'
import githubSecretsModule from './github-secrets'
import azureModule from './helpers/azure'
import identityModule from './identity'
import loggingModule from './logging'
import networkModule from './network'

export = async () => {
  const azure = await azureModule()

  const identity = await identityModule()
  const network = await networkModule( { azure, identity } )
  const logging = await loggingModule( { identity } )

  const cluster = await clusterModule( { identity, network, logging } )
  await clusterApplications( { cluster } )

  await githubSecretsModule( { cluster } )

  return {
    logAnalyticsWorkspaceId: logging.logAnalyticsWorkspace.id,
  }
}

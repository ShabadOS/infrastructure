import azureModule from '../shared/azure'
import identityModule from '../shared/identity'
import clusterModule from './cluster'
import clusterApplications from './cluster-applications'
import githubSecretsModule from './github-secrets'
import loggingModule from './logging'
import networkModule from './network'

const stack = async () => {
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

export = stack

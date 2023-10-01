import cluster from '../cluster'
import traefik from './traefik'

type Options = {
  cluster: Awaited<ReturnType<typeof cluster>>,
}

const clusterApplicationsModule = async ( { cluster }: Options ) => {
  traefik( { cluster } )
}

export default clusterApplicationsModule

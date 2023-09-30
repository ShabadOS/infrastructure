import cluster from '../cluster'
import traefik from './traefik'

type Options = {
  cluster: Awaited<ReturnType<typeof cluster>>,
}

export = async ( { cluster }: Options ) => {
  traefik( { cluster } )
}

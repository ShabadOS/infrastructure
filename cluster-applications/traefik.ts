import { helm } from '@pulumi/kubernetes'
import { Config } from '@pulumi/pulumi'

import cluster from '../cluster'

type Options = {
  cluster: Awaited<ReturnType<typeof cluster>>,
}

const certificateResolvers = [
  [ 'email', 'team@shabados.com' ],
  [ 'storage', '/acme/acme.json' ],
  [ 'tlschallenge', 'true' ],
]
  .map( ( [ key, value ] ) => [ `--certificatesresolvers.default.acme.${key}`, value ] )
  .map( ( option ) => option.join( '=' ) )

const config = new Config()
  new helm.v3.Chart( 'traefik-ingress', {
    chart: 'traefik',
    version: '10.19.4',
    fetchOpts: { repo: 'https://helm.traefik.io/traefik' },
    values: {
      additionalArguments: [
        ...certificateResolvers,
      ],
      ports: {
        web: { redirectTo: 'websecure' },
      },
      persistence: { enabled: true, path: acmeFolder, size: '128Mi' },
      pilot: {
        enabled: true,
        token: config.requireSecret( 'traefikPilotToken' ),
      },
    },
  }, { provider } )
}

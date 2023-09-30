import { helm } from '@pulumi/kubernetes'
import { Config } from '@pulumi/pulumi'

import cluster from '../cluster'

type Options = {
  cluster: Awaited<ReturnType<typeof cluster>>,
}

const CERT_RESOLVER = 'default'
const ACME_FOLDER = '/acme'
const ACME_VOLUME = 'acme'

const certificateResolvers = [
  [ 'email', 'team@shabados.com' ],
  [ 'storage', `${ACME_FOLDER}/acme.json` ],
  [ 'tlschallenge', 'true' ],
]
  .map( ( [ key, value ] ) => [ `--certificatesresolvers.${CERT_RESOLVER}.acme.${key}`, value ] )
  .map( ( option ) => option.join( '=' ) )

const config = new Config()

export = ( { cluster: { provider } }: Options ) => {
  new helm.v3.Chart( 'traefik-ingress', {
    chart: 'traefik',
    version: '10.19.4',
    fetchOpts: { repo: 'https://helm.traefik.io/traefik' },
    values: {
      deployment: {
        initContainers: [
          {
            name: 'volume-permissions',
            image: 'busybox:1.31.1',
            command: [ 'sh', '-c', `chmod -Rv 600 ${ACME_FOLDER}/*` ],
            volumeMounts: [ { name: ACME_VOLUME, mountPath: ACME_FOLDER } ],
          },
        ],
      },
      additionalArguments: [ ...certificateResolvers ],
      ports: {
        web: { redirectTo: 'websecure' },
        websecure: { tls: { enabled: true, certResolver: CERT_RESOLVER } },
      },
      persistence: { enabled: true, name: ACME_VOLUME, path: ACME_FOLDER, size: '128Mi' },
      pilot: {
        enabled: true,
        token: config.requireSecret( 'traefikPilotToken' ),
      },
    },
  }, { provider } )
}

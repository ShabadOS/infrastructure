import { ActionsOrganizationSecret } from '@pulumi/github'

import cluster from '../cluster'
import * as environment from '../helpers/environment'

type Options = {
  cluster: Awaited<ReturnType<typeof cluster>>,
}

export = async ( { cluster: { kubeconfig } }: Options ) => {
  new ActionsOrganizationSecret( 'kubeconfig-github-secret', {
    secretName: `${environment.name}__KUBECONFIG`,
    visibility: 'all',
    plaintextValue: kubeconfig,
  } )
}

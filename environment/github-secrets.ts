import { ActionsOrganizationSecret } from '@pulumi/github'

import * as environment from '../shared/environment'
import cluster from './cluster'

type Options = {
  cluster: Awaited<ReturnType<typeof cluster>>,
}

const githubSecretsModule = async ( { cluster: { kubeconfig } }: Options ) => {
  new ActionsOrganizationSecret( 'kubeconfig-github-secret', {
    secretName: `${environment.name.toUpperCase()}__KUBECONFIG`,
    visibility: 'all',
    plaintextValue: kubeconfig,
  }, { deleteBeforeReplace: true } )
}

export default githubSecretsModule

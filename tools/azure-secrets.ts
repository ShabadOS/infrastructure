import { ActionsOrganizationSecret } from '@pulumi/github'
import { Output } from '@pulumi/pulumi'

import azure from '../shared/azure'
import * as environment from '../shared/environment'
import identity from '../shared/identity'

type Options = {
  azure: Awaited<ReturnType<typeof azure>>,
  identity: Awaited<ReturnType<typeof identity>>,
}

const azureSecretsModule = async ( {
  identity: { application, servicePrincipalPassword },
  azure: { tenantId, subscriptionId },
}: Options ) => ( [
  [ 'tenant-id', 'TENANT_ID', tenantId ],
  [ 'subscription-id', 'SUBSCRIPTION_ID', subscriptionId ],
  [ 'client-id', 'CLIENT_ID', application.applicationId ],
  [ 'client-secret', 'CLIENT_SECRET', servicePrincipalPassword ],
  [ 'credentials', 'CREDENTIALS', JSON.stringify( { tenantId, subscriptionId, clientId: application.applicationId, clientSecret: servicePrincipalPassword } ) ],
] as const ).map( ( [
  name,
  secretName,
  value,
] ) => new ActionsOrganizationSecret( `azure-${name}-github-secret`, {
  secretName: `${environment.name.toUpperCase()}__AZURE_${secretName}`,
  visibility: 'all',
  plaintextValue: value as Output<string>,
} ) )

export default azureSecretsModule

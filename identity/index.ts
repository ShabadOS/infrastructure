import { ResourceGroup } from '@pulumi/azure-native/resources'
import { Application, ServicePrincipal, ServicePrincipalPassword } from '@pulumi/azuread'

import * as environment from '../helpers/environment'

export const application = new Application( `${environment.name}-environment-app`, { displayName: `${environment.name}-environment-app` } )

export const servicePrincipal = new ServicePrincipal( `${environment.name}-environment-service-principal`, {
  applicationId: application.applicationId,
} )

export const servicePrincipalPassword = new ServicePrincipalPassword( `${environment.name}-environment-service-principal-password`, {
  servicePrincipalId: servicePrincipal.id,
  endDate: '2099-01-01T00:00:00Z',
} )

export const resourceGroup = new ResourceGroup( environment.name )

import { ResourceGroup } from '@pulumi/azure-native/resources'
import { Application, ServicePrincipal } from '@pulumi/azuread'

import * as environment from '../helpers/environment'

export const application = new Application( `${environment.name}-app`, { displayName: `App (${environment.name})` } )

export const servicePrincipal = new ServicePrincipal( `${environment.name}-service-principal`, {
  applicationId: application.applicationId,
} )

export const resourceGroup = new ResourceGroup( environment.name )

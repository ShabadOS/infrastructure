import * as azure from '@pulumi/azure-native'
import * as azuread from '@pulumi/azuread'

import * as environment from '../helpers/environment'

export const application = new azuread.Application( `${environment.name}-app`, { displayName: `App (${environment.name})` } )

export const servicePrincipal = new azuread.ServicePrincipal( `${environment.name}-service-principal`, {
  applicationId: application.applicationId,
} )

export const resourceGroup = new azure.resources.ResourceGroup( environment.name )

import { Workspace } from '@pulumi/azure-native/operationalinsights'

import identity from '../shared/identity'

type Options = {
  identity: Awaited<ReturnType<typeof identity>>,
}

const loggingModule = async ( { identity: { resourceGroup } }: Options ) => {
  const logAnalyticsWorkspace = new Workspace( 'default-workspace', {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    retentionInDays: 30,
  } )

  return { logAnalyticsWorkspace }
}

export default loggingModule

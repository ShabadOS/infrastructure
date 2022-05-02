import { Workspace } from '@pulumi/azure-native/operationalinsights'

import identity from '../identity'

type Options = {
  identity: Awaited<ReturnType<typeof identity>>,
}

export = async ( { identity: { resourceGroup } }: Options ) => {
  const logAnalyticsWorkspace = new Workspace( 'default-workspace', {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    retentionInDays: 14,
  } )

  return { logAnalyticsWorkspace }
}

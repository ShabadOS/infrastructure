import { getClientConfig } from '@pulumi/azure-native/authorization'

const azureModule = async () => {
  const { subscriptionId, tenantId } = await getClientConfig()

  return { subscriptionId, tenantId }
}

export default azureModule

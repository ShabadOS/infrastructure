import { getClientConfig } from '@pulumi/azure-native/authorization'

export = async () => {
  const { subscriptionId, tenantId } = await getClientConfig()

  return { subscriptionId, tenantId }
}

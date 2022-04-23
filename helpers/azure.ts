import { getClientConfig } from '@pulumi/azure-native/authorization'

export = async () => {
  const { subscriptionId } = await getClientConfig()

  return { subscriptionId }
}

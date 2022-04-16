import { getStack } from '@pulumi/pulumi'

export const name = getStack()

export const isProduction = name === 'production'

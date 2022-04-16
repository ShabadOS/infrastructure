import * as pulumi from '@pulumi/pulumi'

export const name = pulumi.getStack()

export const isProduction = name === 'production'

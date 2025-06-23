import { Schema } from '../objects/schema'
import { Role } from '../roles/role'
import { Privilege } from '../privilege'
import { SchemaObjectGrant, SchemaObjectGrantKind } from './schemaObjectGrant'
import { Grant } from './grant'

export class DynamicTableGrant extends SchemaObjectGrant {
  schema: Schema
  dynamicTable?: { name: string }  // Using a simple object since there's no DynamicTable class yet
  future: boolean
  privilege: Privilege
  role: Role
  dependsOn?: Grant[]
  kind: SchemaObjectGrantKind = 'dynamic_table'

  constructor(
    schema: Schema,
    future: boolean,
    privilege: Privilege,
    role: Role,
    dynamicTable?: { name: string },
    dependsOn?: Grant[]
  ) {
    super()
    this.schema = schema
    this.dynamicTable = dynamicTable
    this.future = future
    this.privilege = privilege
    this.role = role
    this.dependsOn = dependsOn
  }

  objectName(): string | undefined {
    return this.dynamicTable?.name
  }
}
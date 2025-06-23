import {Schema} from '../objects/schema'
import {Role} from '../roles/role'
import {Privilege} from '../privilege'
import {SchemaObjectGrant, SchemaObjectGrantKind} from './schemaObjectGrant'
import {Grant} from './grant'

export class SemanticViewGrant extends SchemaObjectGrant {
  schema: Schema
  semanticView?: { name: string }
  future: boolean
  privilege: Privilege
  role: Role
  dependsOn?: Grant[]
  kind: SchemaObjectGrantKind = 'semantic_view'

  constructor(
    schema: Schema,
    future: boolean,
    privilege: Privilege,
    role: Role,
    semanticView?: { name: string },
    dependsOn?: Grant[]
  ) {
    super()
    this.schema = schema
    this.semanticView = semanticView
    this.future = future
    this.privilege = privilege
    this.role = role
    this.dependsOn = dependsOn
  }

  objectName(): string | undefined {
    return this.semanticView?.name
  }
}
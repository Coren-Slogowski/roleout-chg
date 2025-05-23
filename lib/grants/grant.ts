import { Privilege } from '../privilege'
import { Role } from '../roles/role'
import {SchemaObjectGrant, SchemaObjectGrantKind} from './schemaObjectGrant'
import {SchemaGrant} from './schemaGrant'
import {DatabaseGrant} from './databaseGrant'
import {VirtualWarehouseGrant} from './virtualWarehouseGrant'

export type GrantType = 'DatabaseSchemaObjectsGrant' | 'DatabaseSchemataGrant' | 'SchemaObjectGrant' | 'SchemaGrant' | 'DatabaseGrant' | 'VirtualWarehouseGrant'
export type GrantKind = SchemaObjectGrantKind | 'schema' | 'database' | 'virtual_warehouse'

export interface Grant {
  privilege: Privilege
  role: Role
  type: GrantType
  kind: GrantKind
}

export function isSchemaObjectGrant(obj: Grant): obj is SchemaObjectGrant {
  return 'type' in obj && obj.type === 'SchemaObjectGrant'
}

export function isSchemaGrant(obj: Grant): obj is SchemaGrant {
  return 'type' in obj && obj.type === 'SchemaGrant'
}

export function isDatabaseGrant(obj: Grant): obj is DatabaseGrant {
  return 'type' in obj && obj.type === 'DatabaseGrant'
}

export function isVirtualWarehouseGrant(obj: Grant): obj is VirtualWarehouseGrant {
  return 'type' in obj && obj.type === 'VirtualWarehouseGrant'
}

// src/lib/rbac.ts
export const permissions: Record<string, string[]> = {
  super_admin: ['*'],
  editor: ['post:create', 'post:edit', 'post:publish', 'media:upload', 'media:delete'],
  copywriter: ['post:create', 'post:edit:own'],
}

export function can(role: string, action: string): boolean {
  const allowed = permissions[role] ?? []
  return allowed.includes('*') || allowed.includes(action)
}
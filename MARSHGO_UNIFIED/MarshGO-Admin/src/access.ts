export function hasPlatformAdminRole(roles: readonly string[]) {
  return roles.includes('admin');
}

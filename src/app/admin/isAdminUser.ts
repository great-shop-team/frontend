const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_ROLES = new Set(['admin', 'administrator', 'staff', 'superuser', 'manager']);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null;
  return value as Record<string, unknown>;
}

function nodesOf(user: unknown) {
  const root = asRecord(user);
  if (!root) return [];

  const nested = asRecord(root.user);
  return nested ? [root, nested] : [root];
}

function roleOf(node: Record<string, unknown>) {
  for (const key of ['role', 'user_role', 'user_type'] as const) {
    const value = node[key];
    if (typeof value === 'string' && value.trim()) return value.trim().toLowerCase();
  }

  return null;
}

function isAdminEmail(value: string) {
  return value.trim().toLowerCase() === ADMIN_EMAIL;
}

export function isAdminUser(user: unknown, email?: string | null) {
  const emails = [email, ...nodesOf(user).map((node) => node.email)].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  );

  if (emails.some(isAdminEmail)) return true;

  return nodesOf(user).some((node) => {
    if (node.is_staff === true || node.is_superuser === true || node.is_admin === true) return true;
    const role = roleOf(node);
    return Boolean(role && ADMIN_ROLES.has(role));
  });
}

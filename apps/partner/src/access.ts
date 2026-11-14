export function canOpenPartnerWorkspace(organizations: readonly { membership_status: string; organization_status: string }[]) {
  return organizations.some((item) => item.membership_status === 'ACTIVE' && item.organization_status !== 'REJECTED');
}

export function operationalFeaturesEnabled(organization: { membership_status: string; organization_status: string } | null) {
  return organization?.membership_status === 'ACTIVE' && organization.organization_status === 'ACTIVE';
}

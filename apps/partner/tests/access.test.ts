import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canOpenPartnerWorkspace, operationalFeaturesEnabled } from '../src/access';

describe('partner workspace access states', () => {
  it('shows onboarding to an active member while the application is pending', () => {
    assert.equal(canOpenPartnerWorkspace([{ membership_status:'ACTIVE', organization_status:'PENDING_REVIEW' }]), true);
    assert.equal(operationalFeaturesEnabled({ membership_status:'ACTIVE', organization_status:'PENDING_REVIEW' }), false);
  });
  it('does not open a workspace for inactive or rejected membership', () => {
    assert.equal(canOpenPartnerWorkspace([{ membership_status:'SUSPENDED', organization_status:'ACTIVE' }]), false);
    assert.equal(canOpenPartnerWorkspace([{ membership_status:'ACTIVE', organization_status:'REJECTED' }]), false);
  });
  it('enables operations only after approval and while membership remains active', () => {
    assert.equal(operationalFeaturesEnabled({ membership_status:'ACTIVE', organization_status:'ACTIVE' }), true);
    assert.equal(operationalFeaturesEnabled({ membership_status:'SUSPENDED', organization_status:'ACTIVE' }), false);
    assert.equal(operationalFeaturesEnabled({ membership_status:'ACTIVE', organization_status:'SUSPENDED' }), false);
  });
});

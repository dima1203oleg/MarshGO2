import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildPartnerQuery } from '../src/adminQuery';

describe('Admin partner filters', () => {
  it('omits empty search and status filters accepted as blank by the UI', () => {
    assert.equal(buildPartnerQuery('', ''), '');
    assert.equal(buildPartnerQuery('   ', ''), '');
  });
  it('trims search and includes only selected filters', () => {
    assert.equal(buildPartnerQuery(' Київ ', ''), '?search=%D0%9A%D0%B8%D1%97%D0%B2');
    assert.equal(buildPartnerQuery('', 'PENDING_REVIEW'), '?status=PENDING_REVIEW');
  });
});

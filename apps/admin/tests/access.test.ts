import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hasPlatformAdminRole } from '../src/access';

describe('MARSHGO Admin presentation guard', () => {
  it('recognizes the current platform administrator role', () => {
    assert.equal(hasPlatformAdminRole(['passenger','admin']), true);
  });
  it('does not treat partner roles or frontend flags as platform access', () => {
    assert.equal(hasPlatformAdminRole(['organization_owner','organization_admin']), false);
    assert.equal(hasPlatformAdminRole([]), false);
  });
});

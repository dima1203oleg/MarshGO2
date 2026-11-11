import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AdminApiError, groupVerificationCases, missingVerificationDocuments, rejectionNoteIsIncomplete, verificationDecisionLabel, verificationDocumentLabel, verificationErrorMessage, type VerificationRecord } from '../src/verificationModeration';

const record = (overrides: Partial<VerificationRecord>): VerificationRecord => ({
  id: 'v1', user_id: 'u1', vehicle_id: 'car1', verification_type: 'vehicle', status: 'pending',
  created_at: '2026-10-31T10:00:00.000Z', display_name: 'Оля К.', make: 'Skoda', model: 'Octavia',
  model_year: 2018, seat_count: 4, ...overrides,
});

describe('Admin verification moderation queue', () => {
  it('groups the paired documents of one driver and vehicle into a single review case', () => {
    const cases = groupVerificationCases([
      record({ id: 'license', verification_type: 'driver_license', created_at: '2026-10-31T10:05:00.000Z' }),
      record({ id: 'registration', verification_type: 'vehicle', created_at: '2026-10-31T10:00:00.000Z' }),
      record({ id: 'other', user_id: 'u2', vehicle_id: 'car2', verification_type: 'vehicle' }),
    ]);
    assert.equal(cases.length, 2);
    assert.deepEqual(cases[0].documents.map((d) => d.id), ['registration', 'license']);
    assert.equal(cases[0].vehicleLabel, 'Skoda Octavia · 2018 · 4 місць');
    assert.deepEqual(missingVerificationDocuments(cases[0]), []);
  });
  it('reports which mandatory document is still missing', () => {
    const cases = groupVerificationCases([record({ verification_type: 'vehicle' })]);
    assert.deepEqual(missingVerificationDocuments(cases[0]), ['Посвідчення водія']);
  });
  it('groups driver-only requests that are not attached to a vehicle', () => {
    const cases = groupVerificationCases([record({ vehicle_id: null, verification_type: 'driver_license' })]);
    assert.equal(cases[0].vehicleId, null);
    assert.equal(cases[0].key, 'driver:u1');
  });
  it('keeps the rejection rule and the Ukrainian result labels of the server contract', () => {
    assert.equal(rejectionNoteIsIncomplete('  ab '), true);
    assert.equal(rejectionNoteIsIncomplete('ab c'), false);
    assert.equal(verificationDecisionLabel('verified'), 'Автомобіль схвалено');
    assert.equal(verificationDecisionLabel('pending'), 'Чекає на другий документ');
    assert.equal(verificationDocumentLabel('unknown_type'), 'unknown_type');
  });
  it('translates the moderation error codes instead of leaking server English', () => {
    assert.match(verificationErrorMessage(new AdminApiError('verification_storage_unavailable', 503, 'Private verification evidence storage is not configured')), /не налаштоване/);
    assert.match(verificationErrorMessage(new AdminApiError('verification_evidence_not_reviewed', 409, 'Reviewer must open the private evidence before deciding')), /відкрийте приватні документи/);
    assert.match(verificationErrorMessage(new AdminApiError('verification_already_reviewed', 409, 'Verification was already reviewed')), /вже розглянуто/);
    assert.equal(verificationErrorMessage(new AdminApiError('unexpected_code', 500, 'Boom')), 'Boom');
    assert.equal(verificationErrorMessage(null), 'Не вдалося виконати дію модерації.');
  });
});

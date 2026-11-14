/** Server error envelope carries a machine code; the UI needs it to explain moderation limits in Ukrainian. */
export class AdminApiError extends Error {
  constructor(readonly code: string | undefined, readonly status: number, message: string) {
    super(message);
    this.name = 'AdminApiError';
  }
}

export type VerificationRecord = {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  verification_type: string;
  status: string;
  created_at: string;
  display_name: string | null;
  make: string | null;
  model: string | null;
  model_year: number | null;
  seat_count: number | null;
};

export type ReviewCase = {
  key: string;
  userId: string;
  vehicleId: string | null;
  driverName: string;
  vehicleLabel: string;
  submittedAt: string;
  documents: VerificationRecord[];
};

const documentLabels: Record<string, string> = {
  vehicle: 'Свідоцтво про реєстрацію',
  driver_license: 'Посвідчення водія',
};

const documentOrder = ['vehicle', 'driver_license'];

export function verificationDocumentLabel(verificationType: string): string {
  return documentLabels[verificationType] ?? verificationType;
}

/** A car becomes verified only when both paired documents are approved, so the reviewer
 *  must decide on one driver+vehicle case rather than on isolated records. */
export function groupVerificationCases(records: VerificationRecord[]): ReviewCase[] {
  const cases = new Map<string, VerificationRecord[]>();
  for (const record of records) {
    const key = record.vehicle_id ?? `driver:${record.user_id}`;
    const bucket = cases.get(key);
    if (bucket) bucket.push(record); else cases.set(key, [record]);
  }
  return [...cases.entries()].map(([key, documents]) => {
    const sorted = [...documents].sort((a, b) => {
      const byType = documentOrder.indexOf(a.verification_type) - documentOrder.indexOf(b.verification_type);
      return byType !== 0 ? byType : a.created_at.localeCompare(b.created_at);
    });
    const first = sorted[0];
    const vehicle = first.make ? [`${first.make} ${first.model ?? ''}`.trim(), first.model_year ? String(first.model_year) : null, first.seat_count ? `${first.seat_count} місць` : null]
      .filter(Boolean).join(' · ') : null;
    return {
      key,
      userId: first.user_id,
      vehicleId: first.vehicle_id,
      driverName: first.display_name ?? 'Водій без імені',
      vehicleLabel: vehicle ?? 'Автомобіль не вказано',
      submittedAt: sorted.reduce((earliest, d) => d.created_at < earliest ? d.created_at : earliest, first.created_at),
      documents: sorted,
    };
  }).sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
}

export function missingVerificationDocuments(reviewCase: ReviewCase): string[] {
  const present = new Set(reviewCase.documents.map((document) => document.verification_type));
  return documentOrder.filter((type) => !present.has(type)).map(verificationDocumentLabel);
}

export function rejectionNoteIsIncomplete(note: string): boolean {
  return note.trim().length < 3;
}

export function verificationDecisionLabel(vehicleStatus: string | null): string {
  if (vehicleStatus === 'verified') return 'Автомобіль схвалено';
  if (vehicleStatus === 'rejected') return 'Автомобіль відхилено';
  if (vehicleStatus === 'pending') return 'Чекає на другий документ';
  return 'Рішення збережено';
}

const errorMessages: Record<string, string> = {
  verification_storage_unavailable: 'Сховише приватних доказів не налаштоване. Без доступу до документів модерацію завершити неможливо.',
  verification_evidence_unavailable: 'Документи цієї заявки недоступні. Попросіть водія подати їх повторно.',
  verification_evidence_not_reviewed: 'Спершу відкрийте приватні документи — рішення без перегляду сервер не приймає.',
  verification_already_reviewed: 'Цю заявку вже розглянуто. Оновіть перелік.',
};

export function verificationErrorMessage(error: unknown): string {
  if (error instanceof AdminApiError && error.code && errorMessages[error.code]) return errorMessages[error.code];
  if (error instanceof Error && error.message) return error.message;
  return 'Не вдалося виконати дію модерації.';
}

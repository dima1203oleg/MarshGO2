# Поточний Server PostGIS/Redis integration acceptance

Дата: 22.10.2026, Europe/Kyiv  
Server PR #24: `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c`  
Node: `24.21.0`  
БД: нова loopback `marshgo_e2e_serverinteg_20261022`, PostGIS 17-3.5  
Redis: loopback Redis 7.4; namespace test rate limit окремий.

## Результат

`npm run test:integration`: **30 PASS / 0 FAIL / 0 SKIP**, завершився з exit code `0`. На чистій БД застосовані всі checked-in міграції до migration `055_provider_commercial_use` (історична нумерація містить пропуски та дві міграції `051`; вони не перенумеровувались).

Покриття: Journey schema/PostGIS, live journey API state, OTP/booking inventory, edit/cancellation trip flow, Partner organization tenant isolation, foreground navigation/GPS privacy, Redis-backed realtime між двома API process-ами, persisted booking після API restart і shared rate-limit через Redis.

## Межі доказу

Це ізольований локальний fixture/API integration на loopback, не staging чи production. Не підтверджено реальні SMS, комерційні бронювання, live-provider uptime, production secrets, backup/restore на хостингу, rollback, HTTPS або навантаження. Точні GitHub PR-и лишаються відкриті; статус release лишається `NOT_RELEASED`.

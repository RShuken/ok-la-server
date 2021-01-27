BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),  (
    2,
    'demotest',
    'demotest',
    -- password = "pass"
    '1234Qwer!'
  );

INSERT INTO "language" ("id", "name", "user_id", "is_public")
VALUES
  (1, 'French', 1, 'true'), (2, 'Latin', 1, 'true');

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'amour', 'love', 2),
  (2, 1, 'bonjour', 'hello', 3),
  (3, 1, 'bonheur', 'happiness', 4),
  (4, 1, 'sourire', 'smile', 5),
  (5, 1, 'francais', 'french', 6),
  (6, 1, 'oui', 'yes', 7),
  (7, 1, 'chien', 'dog', 8),
  (8, 1, 'chat', 'cat', null),
  (9, 2, 'amare', 'love', 10),
  (10, 2, 'salve', 'hello', 11),
  (11, 2, 'beatitudinem', 'happiness', 12),
  (12, 2, 'ridere', 'smile', 13),
  (13, 2, 'latine', 'latin', 14),
  (14, 2, 'etiam', 'yes', 15),
  (15, 2, 'canis', 'dog', 16),
  (16, 2, 'cattus', 'cat', null);;


UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;

--  psql -U postgres -d serverName -f ./seeds/seed.tables.sql
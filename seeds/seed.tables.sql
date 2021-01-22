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
    'test',
    'test',
    -- password = "pass"
    '!1Testtest'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'French', 1), (2, 'French2', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'amour', 'love', 2),
  (2, 1, 'bonjour', 'hello', 3),
  (3, 1, 'bonheur', 'happiness', 4),
  (4, 1, 'sourire', 'smile', 5),
  (5, 1, 'francais', 'french', 6),
  (6, 1, 'oui', 'yes', 7),
  (7, 1, 'chien', 'dog', 8),
  (8, 1, 'chat', 'cat', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;

--  psql -U postgres -d spaced-repetition -f ./seeds/seed.tables.sql
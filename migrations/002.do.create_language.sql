CREATE TABLE "language" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "total_score" SMALLINT DEFAULT 0,
  "user_id" INTEGER REFERENCES "user"(id)
    ON DELETE CASCADE NOT NULL,
    "is_public" BOOLEAN DEFAULT 'false'
);

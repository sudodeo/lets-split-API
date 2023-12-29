CREATE TABLE "users" (
  "id" UUID UNIQUE PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
  "first_name" varchar,
  "last_name" varchar,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "address" varchar,
  "dob" date NOT NULL,
  "role" varchar DEFAULT 'user',
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "expenses" (
  "id" UUID UNIQUE PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
  "amount" decimal NOT NULL,
  "currency_code" varchar(3),
  "created_by" UUID,
  "description" varchar,
  "settled" boolean,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "expense_participants" (
  "user_id" UUID,
  "expense_id" UUID,
  "settled" boolean,
  "payment_cut" decimal,
  "currency_code" varchar(3),
  "comments" varchar,
  PRIMARY KEY ("user_id", "expense_id")
);

ALTER TABLE "expenses" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "expense_participants" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "expense_participants" ADD FOREIGN KEY ("expense_id") REFERENCES "expenses" ("id");

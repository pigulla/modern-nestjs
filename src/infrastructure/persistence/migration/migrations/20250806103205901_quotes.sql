-- Up Migration
CREATE TABLE quotes (
  id serial NOT NULL,
  "text" VARCHAR(1000) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT quotes_pk PRIMARY KEY (id)
);

-- Down Migration 
DROP TABLE quotes;
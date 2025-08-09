-- Up Migration
CREATE TABLE authors (
  id serial NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT authors_pk PRIMARY KEY (id)
);

CREATE TABLE quotes (
  id serial NOT NULL,
  author_id int4 NOT NULL,
  "text" VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT quotes_pk PRIMARY KEY (id),
  CONSTRAINT author_fk FOREIGN KEY (author_id) REFERENCES authors ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Down Migration 
DROP TABLE quotes;

DROP TABLE authors;
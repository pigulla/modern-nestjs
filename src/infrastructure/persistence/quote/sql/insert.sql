INSERT INTO
  quotes ("text", author_id, created_at, updated_at)
VALUES
  (
    $(text),
    $(author_id),
    $(created_at),
    $(created_at)
  )
RETURNING
  id,
  "text",
  author_id,
  created_at,
  updated_at;
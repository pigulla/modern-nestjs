UPDATE quotes
SET
  "text" = $(text),
  author_id = $(author_id),
  updated_at = $(updated_at)
WHERE
  id = $(id)
RETURNING
  id,
  "text",
  author_id,
  created_at,
  updated_at;
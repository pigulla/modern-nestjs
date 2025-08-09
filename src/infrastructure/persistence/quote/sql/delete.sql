DELETE FROM quotes
WHERE
  id = $(id)
RETURNING
  id,
  "text",
  author_id,
  created_at,
  updated_at;
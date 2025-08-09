DELETE FROM quotes
WHERE
  id = $(id)
RETURNING
  id,
  "text",
  created_at,
  updated_at;
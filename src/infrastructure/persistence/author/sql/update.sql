UPDATE quotes
SET
  "text" = $(text),
  updated_at = $(updated_at)
WHERE
  id = $(id)
RETURNING
  id,
  "text",
  created_at,
  updated_at;
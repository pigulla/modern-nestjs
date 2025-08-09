SELECT
  id,
  "text",
  created_at,
  updated_at
FROM
  quotes
WHERE
  id = $(id);
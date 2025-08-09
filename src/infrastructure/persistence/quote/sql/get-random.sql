SELECT
  id,
  "text",
  created_at,
  updated_at
FROM
  quotes
ORDER BY
  RANDOM()
LIMIT
  1
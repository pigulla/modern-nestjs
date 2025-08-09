SELECT
  id,
  "text",
  author_id,
  created_at,
  updated_at
FROM
  quotes
ORDER BY
  RANDOM()
LIMIT
  1
INSERT INTO
  quotes ("text", created_at, updated_at)
VALUES
  ($(text), $(created_at), $(created_at))
RETURNING
  id,
  "text",
  created_at,
  updated_at;
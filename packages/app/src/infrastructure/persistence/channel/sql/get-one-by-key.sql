SELECT
  key,
  network_key,
  name,
  description,
  director
FROM
  channels
WHERE
  key = $key;
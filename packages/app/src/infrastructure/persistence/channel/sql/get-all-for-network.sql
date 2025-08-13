SELECT
  key,
  network_key,
  name,
  description,
  director
FROM
  channels
WHERE
  network_key = $network_key;
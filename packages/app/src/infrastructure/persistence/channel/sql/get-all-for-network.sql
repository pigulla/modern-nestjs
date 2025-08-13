SELECT
  id,
  key,
  network_id,
  name,
  description,
  director
FROM
  channels
WHERE
  network_id = $network_id;
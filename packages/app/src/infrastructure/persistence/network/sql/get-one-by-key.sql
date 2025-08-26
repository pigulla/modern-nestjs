SELECT
  id,
  key,
  name,
  url
FROM
  networks
WHERE
  key = $key;
SELECT
  key,
  name,
  url
FROM
  networks
WHERE
  key = $key;
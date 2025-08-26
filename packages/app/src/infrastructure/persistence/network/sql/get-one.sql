SELECT
  id,
  key,
  name,
  url
FROM
  networks
WHERE
  id = $id;
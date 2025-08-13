INSERT INTO
  networks (id, key, name, url)
VALUES
  ($id, $key, $name, $url)
RETURNING
  id,
  key,
  name,
  url;
INSERT INTO
  networks (key, name, url)
VALUES
  ($key, $name, $url)
RETURNING
  key,
  name,
  url;
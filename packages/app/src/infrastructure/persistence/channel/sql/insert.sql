INSERT INTO
  channels (key, network_key, name, description, director)
VALUES
  (
    $key,
    $network_key,
    $name,
    $description,
    $director
  )
RETURNING
  key,
  network_key,
  name,
  description,
  director;
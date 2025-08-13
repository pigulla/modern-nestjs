INSERT INTO
  channels (id, key, network_id, name, description, director)
VALUES
  (
    $id,
    $key,
    $network_id,
    $name,
    $description,
    $director
  )
RETURNING
  id,
  key,
  network_id,
  name,
  description,
  director;
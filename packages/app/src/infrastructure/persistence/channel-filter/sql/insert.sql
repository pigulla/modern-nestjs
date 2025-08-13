INSERT INTO
  channel_filters (id, key, network_id, name, position)
VALUES
  ($id, $key, $network_id, $name, $position)
RETURNING
  id,
  key,
  network_id,
  name,
  position;
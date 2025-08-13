INSERT INTO
  channel_filters (key, network_key, name, position)
VALUES
  ($key, $network_key, $name, $position)
RETURNING
  key,
  network_key,
  name,
  position;
SELECT id, key, network_id, name, description, director
FROM channels
WHERE key = $key;

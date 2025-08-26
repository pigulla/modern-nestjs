CREATE TABLE networks (
  id UINTEGER PRIMARY KEY NOT NULL,
  key VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  url VARCHAR NOT NULL
);

CREATE TABLE channels (
  id UINTEGER PRIMARY KEY NOT NULL,
  network_id UINTEGER REFERENCES networks (id) NOT NULL,
  key VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  director VARCHAR NOT NULL,
  UNIQUE (network_id, key)
);

CREATE TABLE similar_channels (
  channel_id UINTEGER REFERENCES channels (id) NOT NULL,
  similar_channel_id UINTEGER REFERENCES channels (id) CHECK (channel_id <> similar_channel_id) NOT NULL,
  PRIMARY KEY (channel_id, similar_channel_id),
);

CREATE TABLE channel_filters (
  id UINTEGER PRIMARY KEY NOT NULL,
  network_id UINTEGER REFERENCES networks (id) NOT NULL,
  key VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  position INTEGER NOT NULL,
  UNIQUE (id, position),
  UNIQUE (network_id, key)
);

CREATE TABLE channels_to_channel_filters (
  channel_id UINTEGER REFERENCES channels (id) NOT NULL,
  channel_filter_id UINTEGER REFERENCES channel_filters (id) NOT NULL,
  PRIMARY KEY (channel_id, channel_filter_id),
)
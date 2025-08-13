CREATE TABLE networks (
  id INTEGER PRIMARY KEY NOT NULL,
  key VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  url VARCHAR NOT NULL
);

CREATE TABLE channels (
  id INTEGER PRIMARY KEY NOT NULL,
  key VARCHAR UNIQUE NOT NULL,
  network_id INTEGER REFERENCES networks (id) NOT NULL,
  name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  director VARCHAR NOT NULL
);

CREATE TABLE similar_channels (
  channel_id INTEGER REFERENCES channels (id) NOT NULL,
  similar_channel_id INTEGER REFERENCES channels (id) CHECK (channel_id <> similar_channel_id) NOT NULL,
  PRIMARY KEY (channel_id, similar_channel_id),
);

CREATE TABLE channel_filters (
  id INTEGER PRIMARY KEY NOT NULL,
  key VARCHAR UNIQUE NOT NULL,
  network_id INTEGER REFERENCES networks (id) NOT NULL,
  name VARCHAR NOT NULL,
  position INTEGER NOT NULL,
  UNIQUE (id, position)
);

CREATE TABLE channels_to_channel_filters (
  channel_id INTEGER REFERENCES channels (id) NOT NULL,
  channel_filter_id INTEGER REFERENCES channel_filters (id) NOT NULL,
  PRIMARY KEY (channel_id, channel_filter_id),
)
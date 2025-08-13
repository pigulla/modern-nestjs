CREATE TABLE networks (
  key VARCHAR PRIMARY KEY NOT NULL,
  name VARCHAR NOT NULL,
  url VARCHAR NOT NULL
);

CREATE TABLE channels (
  key VARCHAR PRIMARY KEY NOT NULL,
  network_key VARCHAR REFERENCES networks (key) NOT NULL,
  name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  director VARCHAR NOT NULL
);

CREATE TABLE similar_channels (
  channel_key VARCHAR REFERENCES channels (key) NOT NULL,
  similar_channel_key VARCHAR REFERENCES channels (key) CHECK (channel_key <> similar_channel_key) NOT NULL,
  PRIMARY KEY (channel_key, similar_channel_key),
);

CREATE TABLE channel_filters (
  key VARCHAR PRIMARY KEY NOT NULL,
  network_key VARCHAR REFERENCES networks (key) NOT NULL,
  name VARCHAR NOT NULL,
  position INTEGER NOT NULL,
  UNIQUE (key, position)
);

CREATE TABLE channels_to_channel_filters (
  channel_key VARCHAR REFERENCES channels (key) NOT NULL,
  channel_filter_key VARCHAR REFERENCES channel_filters (key) NOT NULL,
  PRIMARY KEY (channel_key, channel_filter_key),
)
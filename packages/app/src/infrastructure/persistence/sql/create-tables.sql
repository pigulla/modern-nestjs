CREATE TABLE networks
(
    id   INTEGER PRIMARY KEY NOT NULL,
    key  VARCHAR UNIQUE      NOT NULL,
    name VARCHAR             NOT NULL,
    url  VARCHAR             NOT NULL
);

CREATE TABLE channels
(
    id          INTEGER PRIMARY KEY              NOT NULL,
    key         VARCHAR UNIQUE                   NOT NULL,
    network_id  INTEGER REFERENCES networks (id) NOT NULL,
    name        VARCHAR                          NOT NULL,
    description VARCHAR                          NOT NULL,
    director    VARCHAR                          NOT NULL
);

CREATE TABLE similar_channels
(
    channel_id         INTEGER REFERENCES channels (id)                                          NOT NULL,
    similar_channel_id INTEGER REFERENCES channels (id) CHECK (channel_id <> similar_channel_id) NOT NULL,
    PRIMARY KEY (channel_id, similar_channel_id),
);

INSERT INTO
  channels_to_channel_filters (channel_key, channel_filter_key)
VALUES
  ($channel_key, $channel_filter_key)
RETURNING
  channel_key,
  channel_filter_key;
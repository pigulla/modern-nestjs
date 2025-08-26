INSERT INTO
  channels_to_channel_filters (channel_id, channel_filter_id)
VALUES
  ($channel_id, $channel_filter_id)
RETURNING
  channel_id,
  channel_filter_id;
SELECT
  channel_filters.key,
  channel_filters.name,
  channel_filters.network_key,
  channel_filters.position,
  COALESCE(
    (
      SELECT
        JSON_GROUP_ARRAY(channels.key)
      FROM
        channels_to_channel_filters
        JOIN channels ON channels.key = channels_to_channel_filters.channel_key
      WHERE
        channels_to_channel_filters.channel_filter_key = channel_filters.key
    ),
    '[]'
  ) AS channel_keys
FROM
  channel_filters;
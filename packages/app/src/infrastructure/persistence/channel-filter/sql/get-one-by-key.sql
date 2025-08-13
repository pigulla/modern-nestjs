SELECT
  channel_filters.id,
  channel_filters.key,
  channel_filters.name,
  channel_filters.network_id,
  channel_filters.position,
  COALESCE(
    (
      SELECT
        JSON_GROUP_ARRAY(channels.id)
      FROM
        channels_to_channel_filters
        JOIN channels ON channels.id = channels_to_channel_filters.channel_id
      WHERE
        channels_to_channel_filters.channel_filter_id = channel_filters.id
    ),
    '[]'
  ) AS channel_ids
FROM
  channel_filters
WHERE
  channel_filters.key = $key;
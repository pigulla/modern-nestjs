INSERT INTO
  authors (first_name, last_name, created_at, updated_at)
VALUES
  (
    'First A.',
    'Authorian',
    '2025-05-15T00:00:00.000Z',
    '2025-05-15T00:00:00.000Z'
  ),
  (
    'Second B.',
    'Smartypants',
    '2025-05-20T00:11:00.000Z',
    '2025-05-21T00:22:00.000Z'
  );

INSERT INTO
  quotes ("text", author_id, created_at, updated_at)
VALUES
  (
    'First Quote',
    2,
    '2025-06-01T00:00:00.000Z',
    '2025-06-01T03:00:00.000Z'
  ),
  (
    'Second Quote',
    2,
    '2025-06-02T00:00:00.000Z',
    '2025-06-02T00:00:00.000Z'
  );
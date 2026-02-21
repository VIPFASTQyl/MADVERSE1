DROP TABLE IF EXISTS activity_registrations CASCADE;

CREATE TABLE activity_registrations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  registration_id BIGINT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  activity_id VARCHAR(255) NOT NULL,
  activity_title VARCHAR(255) NOT NULL,
  activity_category VARCHAR(100),
  activity_date VARCHAR(100),
  activity_location VARCHAR(255),
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(registration_id, activity_id)
);

CREATE INDEX IF NOT EXISTS idx_activity_registrations_registration_id ON activity_registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_activity_registrations_activity_id ON activity_registrations(activity_id);
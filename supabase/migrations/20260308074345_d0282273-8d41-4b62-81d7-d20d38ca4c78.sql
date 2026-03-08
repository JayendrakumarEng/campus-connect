
ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role = ANY (ARRAY['student', 'alumni', 'admin', 'staff']));

ALTER TABLE profiles DROP CONSTRAINT profiles_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_status_check CHECK (status = ANY (ARRAY['Open to Internship', 'Placed', 'Freelancing', 'Not Looking', 'Employed', 'Looking for Internship']));

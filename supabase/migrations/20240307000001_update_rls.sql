-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to providers" ON providers;
DROP POLICY IF EXISTS "Allow read access to countries" ON providers;
DROP POLICY IF EXISTS "Allow read access to country_steps" ON providers;
DROP POLICY IF EXISTS "Allow full access to providers" ON providers;
DROP POLICY IF EXISTS "Allow full access to countries" ON countries;
DROP POLICY IF EXISTS "Allow full access to country_steps" ON country_steps;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON providers FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON providers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON providers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON providers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON countries FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON countries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON countries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON countries FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON country_steps FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON country_steps FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON country_steps FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON country_steps FOR DELETE USING (auth.role() = 'authenticated');
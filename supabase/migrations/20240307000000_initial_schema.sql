-- Create tables
CREATE TABLE IF NOT EXISTS providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    website TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS countries (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS country_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    country_code TEXT NOT NULL REFERENCES countries(code),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    provider_id UUID REFERENCES providers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_steps ENABLE ROW LEVEL SECURITY;

-- Allow read access to all tables
CREATE POLICY "Allow read access to providers" ON providers
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to countries" ON countries
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to country_steps" ON country_steps
    FOR SELECT USING (true);

-- Allow full access to authenticated users
CREATE POLICY "Allow full access to providers" ON providers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to countries" ON countries
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to country_steps" ON country_steps
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert some initial countries
INSERT INTO countries (code, name) VALUES
    ('US', 'United States'),
    ('GB', 'United Kingdom'),
    ('DE', 'Germany'),
    ('FR', 'France'),
    ('CA', 'Canada'),
    ('AU', 'Australia'),
    ('JP', 'Japan'),
    ('SG', 'Singapore')
ON CONFLICT (code) DO NOTHING;
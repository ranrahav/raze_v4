-- First, ensure we have all required countries
INSERT INTO countries (code, name) VALUES
    ('US', 'United States'),
    ('GB', 'United Kingdom'),
    ('DE', 'Germany'),
    ('FR', 'France'),
    ('ES', 'Spain'),
    ('CA', 'Canada'),
    ('AU', 'Australia'),
    ('JP', 'Japan'),
    ('SG', 'Singapore')
ON CONFLICT (code) DO NOTHING;

-- Create mentors table
CREATE TABLE IF NOT EXISTS mentors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    country_code TEXT NOT NULL REFERENCES countries(code),
    relocated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    members_count INTEGER NOT NULL DEFAULT 0,
    country_code TEXT NOT NULL REFERENCES countries(code),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mentors
CREATE POLICY "Enable read access for all users" ON mentors FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON mentors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON mentors FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON mentors FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for communities
CREATE POLICY "Enable read access for all users" ON communities FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON communities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON communities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON communities FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO mentors (name, phone, email, country_code, relocated_at) VALUES
    ('John Smith', '+1-555-0123', 'john.smith@example.com', 'US', '2023-06-15'),
    ('Emma Wilson', '+44-7700-900123', 'emma.wilson@example.com', 'GB', '2023-08-22'),
    ('Hans Mueller', '+49-151-12345678', 'hans.mueller@example.com', 'DE', '2023-09-10'),
    ('Marie Dubois', '+33-6-12345678', 'marie.dubois@example.com', 'FR', '2023-10-05'),
    ('Sofia Garcia', '+34-612-345-678', 'sofia.garcia@example.com', 'ES', '2023-11-15');

INSERT INTO communities (name, platform, url, members_count, country_code) VALUES
    ('USA Expats & Immigrants', 'Facebook', 'https://facebook.com/groups/usa-expats', 25000, 'US'),
    ('Life in London', 'Reddit', 'https://reddit.com/r/lifeinlondon', 15000, 'GB'),
    ('Deutsche in Berlin', 'Telegram', 'https://t.me/deutsche_berlin', 8000, 'DE'),
    ('Americans in Germany', 'Facebook', 'https://facebook.com/groups/americans-in-germany', 12000, 'DE'),
    ('UK Visa Forum', 'Discord', 'https://discord.gg/uk-visa-forum', 5000, 'GB'),
    ('French Expat Network', 'LinkedIn', 'https://linkedin.com/groups/french-expat-network', 18000, 'FR'),
    ('Spain Immigration Hub', 'WhatsApp', 'https://chat.whatsapp.com/spain-immigration', 9500, 'ES');
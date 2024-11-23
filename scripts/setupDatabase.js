import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Create tables
    const { data: providerData, error: providerError } = await supabase
      .from('providers')
      .select('*')
      .limit(1);

    if (providerError && providerError.code === '42P01') {
      console.log('Creating tables...');
      const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
      const sql = await fs.readFile(path.join(migrationsDir, '20240307000000_initial_schema.sql'), 'utf-8');
      
      // Split the SQL into individual statements
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rest.sql(statement.trim());
          if (error) {
            console.error('Error executing SQL:', error);
            throw error;
          }
        }
      }
      console.log('Tables created successfully');
    } else {
      console.log('Tables already exist');
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createSnapshot() {
  const snapshotDir = path.join(__dirname, '..', '.snapshots');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const currentSnapshotDir = path.join(snapshotDir, timestamp);

  try {
    // Create snapshots directory if it doesn't exist
    await fs.mkdir(snapshotDir, { recursive: true });
    await fs.mkdir(currentSnapshotDir, { recursive: true });

    // Copy all relevant files and directories
    const filesToCopy = [
      'src',
      'public',
      'index.html',
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'tailwind.config.js',
      'postcss.config.js',
      'supabase'
    ];

    for (const file of filesToCopy) {
      const sourcePath = path.join(__dirname, '..', file);
      const targetPath = path.join(currentSnapshotDir, file);

      try {
        const stats = await fs.stat(sourcePath);
        if (stats.isDirectory()) {
          await copyDir(sourcePath, targetPath);
        } else {
          await fs.copyFile(sourcePath, targetPath);
        }
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    }

    // Create snapshot metadata
    const metadata = {
      timestamp,
      created: new Date().toISOString(),
      files: filesToCopy
    };

    await fs.writeFile(
      path.join(currentSnapshotDir, 'snapshot.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log(`Snapshot created successfully at ${timestamp}`);
    
    // Save the latest snapshot reference
    await fs.writeFile(
      path.join(snapshotDir, 'latest.txt'),
      timestamp
    );
  } catch (error) {
    console.error('Error creating snapshot:', error);
    process.exit(1);
  }
}

async function copyDir(source, target) {
  await fs.mkdir(target, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      await copyDir(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

createSnapshot();
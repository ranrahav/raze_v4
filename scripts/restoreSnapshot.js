import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function restoreSnapshot() {
  const snapshotDir = path.join(__dirname, '..', '.snapshots');

  try {
    // Read the latest snapshot reference
    const timestamp = await fs.readFile(
      path.join(snapshotDir, 'latest.txt'),
      'utf-8'
    );

    const currentSnapshotDir = path.join(snapshotDir, timestamp.trim());
    const metadata = JSON.parse(
      await fs.readFile(
        path.join(currentSnapshotDir, 'snapshot.json'),
        'utf-8'
      )
    );

    // Restore all files from the snapshot
    for (const file of metadata.files) {
      const sourcePath = path.join(currentSnapshotDir, file);
      const targetPath = path.join(__dirname, '..', file);

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

    console.log(`Snapshot restored successfully from ${timestamp}`);
  } catch (error) {
    console.error('Error restoring snapshot:', error);
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

restoreSnapshot();
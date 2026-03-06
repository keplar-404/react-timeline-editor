#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../');

// Get all entry files
function getEntryFiles() {
  const entriesDir = path.join(projectRoot, 'src/entries');
  if (!fs.existsSync(entriesDir)) {
    console.error('❌ Entries directory not found:', entriesDir);
    process.exit(1);
  }

  const files = fs.readdirSync(entriesDir)
    .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'))
    .map(file => ({
      name: path.basename(file, path.extname(file)),
      path: path.join(entriesDir, file)
    }));

  return files;
}

// Show selection menu
function showMenu(entries) {
  console.log('\n🚀 React Timeline Editor - Example Launcher\n');
  console.log('Select an example to launch:');
  console.log('='.repeat(50));

  entries.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.name}`);
  });

  console.log(`${entries.length + 1}. Main page (all examples)`);
  console.log('0. Exit');
  console.log('='.repeat(50));
}

// Get user selection
async function getUserChoice(entries) {
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nEnter your choice: ', (answer) => {
      rl.close();
      const choice = parseInt(answer);

      if (choice === 0) {
        console.log('👋 Goodbye!');
        process.exit(0);
      }

      if (choice === entries.length + 1) {
        resolve('main');
      } else if (choice >= 1 && choice <= entries.length) {
        resolve(entries[choice - 1].name);
      } else {
        console.log('❌ Invalid choice, please try again');
        resolve(null);
      }
    });
  });
}

// Create HTML file
function createHtmlFile(entryName) {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Timeline Editor - ${entryName}</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/entries/${entryName}.tsx"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(projectRoot, 'index.html'), htmlTemplate);
  console.log(`✅ Created HTML file for: ${entryName}`);
}

// Start dev server
function startDevServer() {
  console.log('\n🚀 Starting dev server...');
  try {
    execSync('yarn vite', {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });
  } catch (error) {
    console.error('❌ Failed to start dev server:', error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  const entries = getEntryFiles();

  if (entries.length === 0) {
    console.error('❌ No entry files found. Please create an example page first.');
    process.exit(1);
  }

  let selectedEntry = null;

  while (!selectedEntry) {
    showMenu(entries);
    selectedEntry = await getUserChoice(entries);
  }

  console.log(`\n🎯 Selected: ${selectedEntry}`);

  // Create the corresponding HTML file
  createHtmlFile(selectedEntry);

  // Start dev server
  startDevServer();
}

// Handle CLI arguments
if (process.argv.length > 2) {
  const arg = process.argv[2];
  if (arg === '--help' || arg === '-h') {
    console.log(`
React Timeline Editor - Example Launcher

Usage:
  yarn example run         Launch interactive selection menu
  yarn example run <name>  Launch a specific example directly

Examples:
  yarn example run basic    Launch the basic example
  yarn example run main     Launch the main page
    `);
    process.exit(0);
  } else {
    // Launch specified example directly
    const entries = getEntryFiles();
    const entryNames = entries.map(e => e.name);

    if (entryNames.includes(arg) || arg === 'main') {
      createHtmlFile(arg);
      startDevServer();
    } else {
      console.error(`❌ Example not found: ${arg}`);
      console.log('Available examples:', entryNames.join(', '));
      process.exit(1);
    }
  }
} else {
  // Interactive launch
  main().catch(console.error);
}
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const componentsDir = path.join(projectRoot, 'src', 'components');
const entriesDir = path.join(projectRoot, 'src', 'entries');
const configFile = path.join(projectRoot, 'src', 'config', 'app-config.ts');

// Get the example name from CLI args
const exampleName = process.argv[2];

if (!exampleName) {
  console.error('❌ Please provide an example name, e.g.: node scripts/create-example.js my-example');
  process.exit(1);
}

// Validate example name format
if (!/^[a-z][a-z0-9-]*$/.test(exampleName)) {
  console.error('❌ Example name must contain only lowercase letters, numbers, and hyphens, and must start with a letter');
  process.exit(1);
}

// Check if the example already exists
const exampleDir = path.join(componentsDir, exampleName);
if (fs.existsSync(exampleDir)) {
  console.error(`❌ Example "${exampleName}" already exists`);
  process.exit(1);
}

// Create the example folder
fs.mkdirSync(exampleDir, { recursive: true });
console.log(`✅ Created example folder: ${exampleName}`);

// Create the component file
const componentContent = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.less';

interface ${capitalizeFirst(exampleName)}Props {
  // Component prop definitions
}

const ${capitalizeFirst(exampleName)}: React.FC<${capitalizeFirst(exampleName)}Props> = () => {
  const navigate = useNavigate();

  return (
    <div className="${exampleName}-container">
      <div className="page-header">
        <button
          className="back-button"
          onClick={() => navigate('/main')}
        >
          ← Back to Main
        </button>
        <h1>${capitalizeFirst(exampleName)} Example</h1>
      </div>
      <p>This is the placeholder content for the ${exampleName} example.</p>
      <div className="${exampleName}-content">
        {/* Example content goes here */}
      </div>
    </div>
  );
};

export default ${capitalizeFirst(exampleName)};
`;

fs.writeFileSync(path.join(exampleDir, `index.tsx`), componentContent);
console.log(`✅ Created component file: ${exampleName}/index.tsx`);

// Create the style file
const cssContent = `.${exampleName}-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.${exampleName}-container .page-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.${exampleName}-container .back-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 20px;
  font-size: 14px;
}

.${exampleName}-container .back-button:hover {
  background: #0056b3;
}

.${exampleName}-container h1 {
  color: #333;
  margin: 0;
}

.${exampleName}-container p {
  color: #666;
  margin-bottom: 24px;
}

.${exampleName}-content {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 200px;
}`;

fs.writeFileSync(path.join(exampleDir, `index.less`), cssContent);
console.log(`✅ Created style file: ${exampleName}/index.less`);

// Create the entry file
const entryContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import ${capitalizeFirst(exampleName)} from '../components/${exampleName}';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <${capitalizeFirst(exampleName)} />
  </React.StrictMode>
);
`;

fs.writeFileSync(path.join(entriesDir, `${exampleName}.tsx`), entryContent);
console.log(`✅ Created entry file: ${exampleName}.tsx`);

// Update the unified config file
updateConfigFile(exampleName);

// Update the main entry file
updateMainEntry(exampleName);

console.log(`\n🎉 Example "${exampleName}" created successfully!`);
console.log(`📁 Component: src/components/${exampleName}/`);
console.log(`📄 Entry file: src/entries/${exampleName}.tsx`);
console.log(`🔧 Config auto-added to src/config/app-config.ts`);
console.log(`🚀 Main entry file updated automatically`);

function capitalizeFirst(str) {
  // Convert hyphen-separated words to PascalCase
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function updateConfigFile(exampleName) {
  const configContent = fs.readFileSync(configFile, 'utf8');

  // Find the end of the appConfigs array
  const configsEndIndex = configContent.lastIndexOf('\n];');
  if (configsEndIndex === -1) {
    console.error('❌ Could not find the appConfigs array in the config file');
    return;
  }

  // Insert the new config before the end of the array
  const newConfig = `
  {
    id: '${exampleName}',
    path: '/${exampleName}',
    componentName: '${capitalizeFirst(exampleName)}',
    title: '${capitalizeFirst(exampleName)}',
    description: '${capitalizeFirst(exampleName)} example',
    route: '/${exampleName}',
    icon: '⭐',
    color: '#${Math.floor(Math.random()*16777215).toString(16)}',
    status: 'development'
  },`;

  const updatedContent = configContent.slice(0, configsEndIndex) + newConfig + configContent.slice(configsEndIndex);

  fs.writeFileSync(configFile, updatedContent);
  console.log(`✅ Updated config file: app-config.ts`);
}

function updateMainEntry(exampleName) {
  const mainEntryFile = path.join(projectRoot, 'src', 'entries', 'main.tsx');
  let mainEntryContent = fs.readFileSync(mainEntryFile, 'utf8');

  // Add import for the new component after the last import statement
  const importStatement = `import ${capitalizeFirst(exampleName)} from '../components/${exampleName}';`;

  // Find the position after the last import statement
  const lastImportIndex = mainEntryContent.lastIndexOf('import');
  const nextLineAfterLastImport = mainEntryContent.indexOf('\n', lastImportIndex) + 1;

  mainEntryContent = mainEntryContent.slice(0, nextLineAfterLastImport) + '\n' + importStatement + mainEntryContent.slice(nextLineAfterLastImport);

  // Add the new component to the component map
  const componentMapStart = mainEntryContent.indexOf('const componentMap: Record<string, React.FC> = {');
  const componentMapEnd = mainEntryContent.indexOf('};', componentMapStart) + 2;

  const componentMapContent = mainEntryContent.slice(componentMapStart, componentMapEnd);
  const lastComponentIndex = componentMapContent.lastIndexOf(',');
  const newComponentMapContent = componentMapContent.slice(0, lastComponentIndex + 1) + `\n  ${capitalizeFirst(exampleName)},` + componentMapContent.slice(lastComponentIndex + 1);

  mainEntryContent = mainEntryContent.slice(0, componentMapStart) + newComponentMapContent + mainEntryContent.slice(componentMapEnd);

  fs.writeFileSync(mainEntryFile, mainEntryContent);
  console.log(`✅ Updated main entry file: main.tsx`);
}

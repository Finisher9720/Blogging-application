const fs = require('fs');
const path = require('path');

// List of folders to include
const INCLUDE_FOLDERS = [
  
  
  'models',
  'routes',
 
  'views'
];

// File extensions to include
const INCLUDE_EXTENSIONS = ['.js', '.ejs'];

// List of root files to exclude
const EXCLUDE_ROOT_FILES = ['dump.js', 'dump.html',"gitignore",'package.json','package-lock.json','tempCodeRunnerFile.js']; // Add any files you want to skip

function shouldInclude(filePath) {
  return INCLUDE_EXTENSIONS.includes(path.extname(filePath));
}

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else if (shouldInclude(filePath)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function dumpProject() {
  // 1. Root-level files, excluding those in EXCLUDE_ROOT_FILES
  let allFiles = fs.readdirSync('.')
    .filter(f => shouldInclude(f) && fs.statSync(f).isFile() && !EXCLUDE_ROOT_FILES.includes(f))
    .map(f => f);

  // 2. Files from folders
  for (const folder of INCLUDE_FOLDERS) {
    if (fs.existsSync(folder)) {
      allFiles = allFiles.concat(walk(folder));
    }
  }

  allFiles.sort();

  let output = '';
  for (const file of allFiles) {
    const relPath = file;
    const content = fs.readFileSync(file, 'utf-8');
    output += `\n<!-- =============================\n     ${relPath}\n     ============================= -->\n`;
    output += '<div>\n<pre><code>\n';
    const escaped = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    output += escaped + '\n';
    output += '</code></pre>\n</div>\n';
  }

  fs.writeFileSync('dump.html', output, 'utf-8');
  console.log('Project dumped to dump.html');
}

if (require.main === module) {
  dumpProject();
}









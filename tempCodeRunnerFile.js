const fs = require("fs");
const path = require("path");
const readline = require("readline");
const chalk = require("chalk");

// File extensions to include
const INCLUDE_EXTENSIONS = [".js", ".ejs"];

// Default root files to always exclude (can be empty if you want)
const DEFAULT_EXCLUDE_ROOT_FILES = [
  "dump.js",
  "dump.html",
  "gitignore",
  "package.json",
  "package-lock.json",
  "tempCodeRunnerFile.js",
];

// Folders to always exclude
const ALWAYS_EXCLUDE_FOLDERS = ["node_modules", ".git", ".vscode"];

function shouldInclude(filePath) {
  return INCLUDE_EXTENSIONS.includes(path.extname(filePath));
}

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else if (shouldInclude(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function getAllFolders() {
  return fs
    .readdirSync(".")
    .filter((f) => {
      const stat = fs.statSync(f);
      return stat.isDirectory() && !ALWAYS_EXCLUDE_FOLDERS.includes(f);
    });
}

function getAllRootFiles() {
  return fs
    .readdirSync(".")
    .filter(
      (f) =>
        fs.statSync(f).isFile() &&
        shouldInclude(f) &&
        !DEFAULT_EXCLUDE_ROOT_FILES.includes(f)
    );
}

function askItemsToExclude(items, label) {
  return new Promise((resolve) => {
    if (!items.length) {
      resolve([]);
      return;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(chalk.green(`\n✅ All ${label} will be INCLUDED by default.`));
    console.log(chalk.yellow(`❌ Enter numbers of ${label} you want to EXCLUDE (comma-separated).`));
    console.log(chalk.gray("ℹ️  Press Enter to include ALL."));

    items.forEach((item, i) => {
      console.log(`  ${i + 1}: ${item}`);
    });

    rl.question(chalk.cyan(`\nExclude ${label} (e.g., 1,3): `), (answer) => {
      const toExcludeIndexes = answer
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .map(Number)
        .map((n) => n - 1)
        .filter((n) => n >= 0 && n < items.length);

      const toExclude = toExcludeIndexes.map((i) => items[i]);
      rl.close();
      resolve(toExclude);
    });
  });
}

async function dumpProject() {
  const allFolders = getAllFolders();
  const allRootFiles = getAllRootFiles();

  const excludeFolders = await askItemsToExclude(allFolders, "folders");
  const excludeRootFiles = await askItemsToExclude(allRootFiles, "root files");

  const includedFolders = allFolders.filter((f) => !excludeFolders.includes(f));
  const includedRootFiles = allRootFiles.filter((f) => !excludeRootFiles.includes(f));

  console.log(chalk.blueBright("\n📄 Confirmation:"));

  console.log(chalk.green("Included folders:"));
  includedFolders.length
    ? includedFolders.forEach((f) => console.log("  -", chalk.greenBright(f)))
    : console.log("  (None)");

  console.log(chalk.red("Excluded folders:"));
  excludeFolders.length
    ? excludeFolders.forEach((f) => console.log("  -", chalk.redBright(f)))
    : console.log("  (None)");

  console.log(chalk.green("\nIncluded root files:"));
  includedRootFiles.length
    ? includedRootFiles.forEach((f) => console.log("  -", chalk.greenBright(f)))
    : console.log("  (None)");

  console.log(chalk.red("Excluded root files:"));
  excludeRootFiles.length
    ? excludeRootFiles.forEach((f) => console.log("  -", chalk.redBright(f)))
    : console.log("  (None)");

  const confirm = await new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(chalk.yellow("\nProceed with these selections? (y/n): "), (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });

  if (confirm !== "y") {
    console.log(chalk.red("\n❌ Aborted by user."));
    process.exit(0);
  }

  let allFiles = [...includedRootFiles];

  // Add files from included folders
  for (const folder of includedFolders) {
    allFiles = allFiles.concat(walk(folder));
  }

  allFiles.sort();

  let output = "";
  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    output += `\n<!-- =============================\n     ${file}\n     ============================= -->\n`;
    output += "<div>\n<pre><code>\n";
    const escaped = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    output += escaped + "\n";
    output += "</code></pre>\n</div>\n";
  }

  fs.writeFileSync("dump.html", output, "utf-8");
  console.log(chalk.greenBright("\n✅ Project dumped to dump.html"));
}

if (require.main === module) {
  dumpProject();
}

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const htmlMin = require('htmlmin');
const ROOT_FOLDER = path.join(__dirname, '..');
const SOURCE_FOLDER = path.join(ROOT_FOLDER, 'src');
const BUILD_FOLDER = path.join(ROOT_FOLDER, 'build');
const COMPRESSED_BUILD_FOLDER = path.join(ROOT_FOLDER, 'build-min');
const COMPRESSED_BUILD_FILE = path.join(COMPRESSED_BUILD_FOLDER, 'build.zip');
const COMMIT_LOG_PATH = path.join(ROOT_FOLDER, 'commit-log.md');
const HTML_INDEX = path.join(ROOT_FOLDER, 'index.html');
const HTML_INDEX_BUILD = path.join(BUILD_FOLDER, 'index.html');

function getFolderSize(path) {
  const stout = execSync(`ls -l ${path} | awk '{sum+=$5} END {printf sum}'`, {
    encoding: 'utf8'
  });
  const by = parseInt(stout);
  const kb = (by / 1024).toFixed(2);
  return [kb, by];
}

function checkExists(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function buildHtml() {
  const index = fs.readFileSync(HTML_INDEX, { encoding: 'utf8' });
  fs.writeFileSync(
    HTML_INDEX_BUILD,
    htmlMin(index.replace('/build/bundle.min.js', './bundle.min.js'))
  );
}

function runHook(args) {
  let LOG_MESSAGE = '';

  // we will need these folders
  checkExists(BUILD_FOLDER);
  checkExists(COMPRESSED_BUILD_FOLDER);

  // add the commit message
  const commitMessage = args
    ? fs.readFileSync(args[2], { encoding: 'utf8' })
    : 'no commit\n';
  LOG_MESSAGE += `**${commitMessage.trim()}** - `;

  // add the current date
  LOG_MESSAGE += `*${new Date().toUTCString()}*\n`;

  // add table header
  LOG_MESSAGE += `| Measure | Size (kb) | Size (bytes) | Reduction |\n`;
  LOG_MESSAGE += `| --- | --- | --- | --- |\n`;

  // log the size of the uncompressed source
  const [kb0, bytes0] = getFolderSize(path.join(SOURCE_FOLDER, '/*'));
  LOG_MESSAGE += `| Raw Source Code | ${kb0} kb | ${bytes0} | NA |\n`;

  // perform the production build and log new size
  execSync(`rm -rf ${path.join(BUILD_FOLDER, '/*')}`);
  execSync('rollup -c --environment BUILD:production');
  buildHtml();
  const [kb1, bytes1] = getFolderSize(path.join(BUILD_FOLDER, '/*'));
  LOG_MESSAGE += `| Build | ${kb1} kb | ${bytes1} | ${
    bytes1 < bytes0 ? '-' : '+'
  }${Math.round((100 * (bytes0 - bytes1)) / bytes0)}% |\n`;

  // perform .zip compression and log new size
  execSync(`rm -rf ${path.join(COMPRESSED_BUILD_FOLDER, '/*')}`);
  execSync(`cd ${BUILD_FOLDER}; zip -r -j ${COMPRESSED_BUILD_FILE} ./*`);
  const [kb2, bytes2] = getFolderSize(path.join(COMPRESSED_BUILD_FOLDER, '/*'));
  LOG_MESSAGE += `| Compressed Build | ${kb2} kb | ${bytes2} | ${
    bytes2 < bytes1 ? '-' : '+'
  }${Math.round((100 * (bytes1 - bytes2)) / bytes1)}% |\n`;

  // perform adv zip and log new size
  execSync('advzip -z -4 -i 10000 ' + COMPRESSED_BUILD_FILE);
  const [kb3, bytes3] = getFolderSize(path.join(COMPRESSED_BUILD_FOLDER, '/*'));
  LOG_MESSAGE += `| Compressed Build (Adv Zip) | ${kb3} kb | ${bytes3} | ${
    bytes3 < bytes2 ? '-' : '+'
  }${Math.round((100 * (bytes2 - bytes3)) / bytes2)}% |\n`;

  // breaks for the next entry:
  LOG_MESSAGE += '\n\n';

  // update the log
  fs.open(COMMIT_LOG_PATH, 'a+', (err, fd) => {
    fs.write(fd, LOG_MESSAGE, null, (err) => {
      if (err) throw err;
    });
  });
}

module.exports = runHook;

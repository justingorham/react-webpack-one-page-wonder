/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const globby = require('globby');
const sass = require('node-sass');
const argv = require('minimist')(process.argv.slice(2),
  {
    "string": ["dir", "index"],
    "boolean": ["w"],
    "default": {
      index: "index.json"
    }
  });

if (!argv.dir) {
  console.error(new Error('Must specify \'dir\' param'));
  process.exit(1);
}

let dir = path.resolve(argv.dir);

function listDirFiles({
  dir,
  patterns = ['**/*'],
  nocase = true
}) {

  if (!dir) {
    return Promise.resolve([]);
  }
  return globby(patterns, {
    nodir: true,
    cwd: dir,
    nocase
  });
}

function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      return err ? reject(err) : resolve();
    });
  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      return err ? reject(err) : resolve(data);
    });
  });
}

function compileSassFile(file) {
  let dirname = path.dirname(file);
  let ext = path.extname(file);
  let basename = path.basename(file, ext);
  let outFile = path.join(dirname, `${basename}.css`);
  return new Promise((resolve, reject) => {
    sass.render({
      file,
    }, (error, result) => {
      return error ? reject(error) : resolve(result.css);
    });
  })
    .then(css => writeFile(outFile, css));
}

function compileAllSassFiles() {
  return listDirFiles({dir, patterns: ['**/*.scss', '**/*.sass']})
    .then(sassFiles => Promise.all(sassFiles.map(s => compileSassFile(path.join(dir, s)))));
}

const ignoreGlobs = [
  /^\.idea/,
  /__jb_(tmp|old)__/
];

function shouldIgnoreFile(filename) {
  return ignoreGlobs.filter(g => g.exec(filename) != null).length > 0;
}

function watchDirectory() {
  if (!argv.w) {
    return;
  }
  fs.watch(dir, {recursive: true, encoding: 'utf8'}, (eventType, filename) => {
    let shouldSkip = !filename
      || filename == argv.index
      || path.extname(filename).trim() == ''
      || shouldIgnoreFile(filename);

    if (shouldSkip) {
      return;
    }

    console.log(eventType, filename);
    let task = filename.match(/\.(scss|sass)$/i)
      ? compileAllSassFiles().then(() => listDirFiles({dir}))
      : listDirFiles({dir});

    task
      .then(filesJson => filesJson.filter(j => j != argv.index))
      .then(filesJson => writeFile(path.join(dir, argv.index), JSON.stringify(filesJson)));

  });
  console.log(`Watching ${dir}`);
}

/* main */
compileAllSassFiles()
  .then(() => listDirFiles({dir}))
  .then(filesJson => filesJson.filter(j => j != argv.index))
  .then(filesJson => writeFile(path.join(dir, argv.index), JSON.stringify(filesJson)))
  .then(watchDirectory)
  .catch(console.error);


const fs = require('fs')
const rollup = require('rollup')

if (!fs.existsSync('../dist')) {
  fs.mkdirSync('../dist')
}

async function buildEntry (config) {
  const bundle = await rollup.rollup(config);
  if (Array.isArray(config.output)) {
    await Promise.all(config.output.map(cur => bundle.write(cur)));
  } else {
    await bundle.write(config.output);
  }
}
function buildAll (config) {
  if (Array.isArray(config)) {
    return Promise.all(config.map(one => buildEntry(one)));
  }
}

function watchAll(config) {
  const watcher = rollup.watch(Object.assign(config, {
    watch: {

    }
  }));
  return watcher;
}
buildAll.watchAll = watchAll;
module.exports = buildAll;

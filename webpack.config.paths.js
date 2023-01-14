const path = require('path');
const PARTIAL_HEADER = path.resolve(
  __dirname,
  './src/app/components/header/template'
);
const PARTIAL_TAB = path.resolve(
  __dirname,
  './src/app/components/tab/template'
);

module.exports.paths = {

    partial_header: PARTIAL_HEADER,
    partial_tab: PARTIAL_TAB,
  };
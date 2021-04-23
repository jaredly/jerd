// For comiling & running main.js
const { execSync } = require('child_process');

// Have esbuild ensure our main.js is up to date
execSync('yarn run compile');

// Run it!
require('./main.js');

// For comiling & running main.js
const { execSync } = require('child_process');
const fs = require('fs');
const stat = fs.statSync('./main.js');
const contents = fs.readFileSync('./main.js', 'utf8');

// Have esbuild ensure our main.js is up to date
execSync('yarn run compile');
const newContents = fs.readFileSync('./main.js', 'utf8');
if (newContents === contents) {
    console.log(`[resetting utimes ${stat.mtime}]`);
    fs.utimesSync('./main.js', stat.atime, stat.mtime);
}

// Run it!
require('./main.js');

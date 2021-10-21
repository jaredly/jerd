// For comiling & running main.js
const { execSync } = require('child_process');
const fs = require('fs');
process.chdir(__dirname);

const [_, __, target] = process.argv;

const cmd = `yarn esbuild ${target} --platform=node --sourcemap --bundle --outfile=run.bootstrap.js`;

// const stat = fs.statSync('./main.js');
// const contents = fs.readFileSync('./main.js', 'utf8');

// Have esbuild ensure our main.js is up to date
try {
    execSync(cmd, { stdio: 'pipe' });
} catch (err) {
    console.log(err.stdout.toString('utf8'));
    console.log(err.stderr.toString('utf8'));
}
// const newContents = fs.readFileSync('./main.js', 'utf8');
// if (newContents === contents) {
//     console.log(`[resetting utimes ${stat.mtime}]`);
//     fs.utimesSync('./main.js', stat.atime, stat.mtime);
// }

process.argv.splice(2, 1);

// Run it!
require('./run.bootstrap.js');

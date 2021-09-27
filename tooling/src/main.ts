import * as t from '@babel/types';
import babel from '@babel/core';
import fs from 'fs';

const [_, __, inFile, outFile] = process.argv;
const ast = babel.parse(fs.readFileSync(inFile, 'utf8'), {
    filename: inFile,
    presets: ['@babel/preset-typescript'],
});

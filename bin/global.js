#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');

const currentPath = path.resolve();
const configFile = [currentPath, 'lazerpath.config.js'].join('/');

if (!fs.existsSync(configFile)) {
    throw new Error(`File lazerpath.config.js not found in ${currentPath}`);
}

const config = require(configFile);

if (!config.hasOwnProperty('paths')) {
    throw new Error(`Missing paths property in config file: ${JSON.stringify(config)}`);
}

const {paths} = config;
const {LazerPath} = require('../lib/index');

let test = false;

program
    .version('1.2.0', '-v, --version')
    .option('-t, --test', 'test your paths, no file or folder will be created')
    .parse(process.argv);


if (program.test) test = true;

const testLog = test ? '[Test] ' : '';

console.log(`${testLog}LazerPath Start`);

if (!Object.keys(paths).length) {
    console.log(`${testLog}Empty paths`);
    return;
}

LazerPath.init(paths, test);
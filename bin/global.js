#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');

program
    .version('1.2.0', '-v, --version')
    .option('-t, --test', 'test your paths, no file or folder will be created')
    .parse(process.argv);

const currentPath = path.resolve();
const configFile = [currentPath, 'lazerpath.config.js'].join('/');

if (!fs.existsSync(configFile)) {
    console.log(`File lazerpath.config.js not found in ${currentPath}`);
    return;
}

const config = require(configFile);

if (!config.hasOwnProperty('paths')) {
    console.log(`Missing paths property in config file: ${JSON.stringify(config)}`);
    return;
}



const {paths} = config;
const {LazerPath} = require('../lib/index');

let test = false;

if (program.test) test = true;

const testLog = test ? '[Test] ' : '';

console.log(`${testLog}LazerPath Start`);

if (!Object.keys(paths).length) {
    console.log(`${testLog}Empty paths`);
    return;
}

LazerPath.init(paths, test);
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.splice(process.execArgv.length + 2);
const test = args.length > 0 && args[0] === 'test';

const currentPath = path.resolve();
const config = [currentPath, 'lazerpath.config.js'].join('/');

if (!fs.existsSync(config)) {
    throw new Error(`File lazerpath.config.js not found in ${currentPath}`);
}

const {paths} = require(config);
const {LazerPath} = require('../lib/index');

LazerPath.init(paths, test);
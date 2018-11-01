const fs = require('fs');

const LazerPath = {

    color_folder : "\x1b[36m%s\x1b[0m",
    color_file   : "\x1b[32m%s\x1b[0m",
    color_replace: "\x1b[33m%s\x1b[0m",
    color_alert  : "\x1b[35m%s\x1b[0m",
    test         : true,

    init: function (paths, test = false) {

        this.test = test;
        this.parseStcuture(paths);
        console.log(`\x1b[0m${this.test ? '[Test] ' : ''}Lazerpath process successfully completed`);

    },

    parseStcuture: function (paths, stack = '') {
        Object.keys(paths).map(key => {
            if (paths[key].constructor === Object && !key.startsWith("/")) {
                throw new Error(`You missed the / before folder name "${key}"`);
            }
            if (paths[key].constructor === Object && key.startsWith("/")) {

                this.makeDir(stack, key);
                this.parseStcuture(paths[key], stack + key);

            }
            else if (paths[key].constructor === Array) {

                if (paths[key].length === 0 || typeof paths[key][0] !== 'string') {
                    throw new Error(`Please insert the file content as first array element, ref: ${stack}${key}`);
                }

                let fileContent = paths[key][0];
                let replaced = [];

                if (paths[key].length > 1 && typeof paths[key][1] === 'object' && Object.keys(paths[key][1]).length) {
                    const replace = this.searchAndReplace(fileContent, paths[key][1]);

                    fileContent = replace[0];
                    replaced = replace[1];
                }

                this.writeFile(stack, key, fileContent, replaced);

            }
            else {
                this.writeFile(stack, key, paths[key]);
            }

        });
    },


    makeDir: function (stack, key) {
        const dir = `.${stack}${key}`;

        if (!fs.existsSync(dir)) {
            if (this.test) {
                console.log(this.color_folder, '[TEST] Dir OK    : ' + dir);
            }
            else {
                fs.mkdirSync(dir);
                console.log(this.color_folder, 'Dir OK    : ' + dir);
            }
        }
        else {
            if (this.test) {
                console.log(this.color_alert, '[TEST] Dir already exists : ' + dir);
            }
            else {
                console.log(this.color_alert, 'Dir already exists : ' + dir);
            }
        }
    },

    writeFile: function (stack, key, fileContent, replaced = []) {
        const file = `.${stack}/${key}`;

        if (!fs.existsSync(file)) {
            if (this.test) {
                console.log(this.color_file, '[TEST] File OK   : ' + file);
                replaced.forEach(values => console.log(this.color_replace, `[Test] Replace OK:   String "${values[0]}" Replaced with "${values[1]}"`));
            }
            else {
                fs.writeFileSync(file, fileContent);
                console.log(this.color_file, 'File OK   : ' + file);
                replaced.forEach(values => console.log(this.color_replace, `Replace OK:   String "${values[0]}" Replaced with "${values[1]}"`));
            }
            return file;
        }
        else {
            if (this.test) {
                console.log(this.color_alert, '[TEST] File already exists: ' + file);
            }
            else {
                console.log(this.color_alert, 'File already exists: ' + file);
            }
        }
        return null;
    },

    searchAndReplace: function (fileContent, obj) {

        const replaced = Object.keys(obj).map(key => {

            const pattern = new RegExp(/^[a-z0-9_.-]+$/i);

            if (!pattern.test(key)) {
                throw new Error(`The property name to replace may only contain letters, numbers, underscores, dashes and dots. Ref: ${key}`);
            }

            const replace = new RegExp(key, 'g');
            fileContent = fileContent.replace(replace, obj[key]);

            return [key, obj[key]];

        });
        return [fileContent, replaced];
    },


};

exports.LazerPath = LazerPath;
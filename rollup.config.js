import { createDefaultConfig } from '@open-wc/building-rollup';
const indexHTML = require('./node_modules/rollup-plugin-index-html');
import copy from 'rollup-plugin-cpy';
import rimraf from 'rimraf';

/*
DOES NOT WORK YET BECAUSE I NEED TO FIGURE OUT HOW TO BUNDLE THE DYNAMIC
IMPORTS PROVIDED BY app.js and stage.js
 */
const config = createDefaultConfig({
    input: './demo/index.html',
    outputDir: 'docs',
});

config.plugins.push(
    rimraf.sync('docs'),
    copy({
        // copy over all images files
        files: ['./demo/images/*.*'],
        dest: 'docs',
        options: {
            // parents makes sure to preserve the original folder structure
            parents: true
        }
    })
);

export default config;

#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const { getInstalledPathSync } = require('get-installed-path')
const async = require('async')
const chalk = require('chalk')
const log = console.log
const emoji = require('node-emoji')

// Path to the templates folder
const templatePath = getInstalledPathSync('lyrical-cli') + '/templates/'

// Helper function to capitalise the first characer
const capitalizeFirst = (lower) => lower.toLowerCase().replace(/^\w/, c => c.toUpperCase())

/**
 * Creates all files based on provided files array
 * 
 * @param {array} files path to templates, destination folder & success message
 * @param {string} name Resource name
 */
const createFiles = (files, name) => {
    async.each(files, function(file) {
        fs.readFile(file.path, 'utf8', (err, fd) => {
            if (err) throw err
            let model_name = name,
                data = String(fd),
                up_re = new RegExp('%UP_MODEL%', 'gm'),
                low_re = new RegExp('%LOW_MODEL%', 'gm'),
                filename = file.dest
    
            data = data.replace(up_re, capitalizeFirst(model_name))
            data = data.replace(low_re, model_name.toLowerCase())
    
            fs.writeFile(filename, data, (err) => {
                if (err) throw err
                log(chalk.green( emoji.emojify(':fire:  ' + file.success )))
            })
        })
    }, function(err) {
        if (err) throw err
    })
}

/**
 * Defines files used for a Model & its Helper class
 * 
 * @param {string} name Resource Name
 */
const createModel = (name) => {
    const files = [
        {
            path: templatePath + 'model.txt',
            dest: 'models/' + capitalizeFirst(name) + '.js',
            success: `The '${chalk.bold(name)}' model structure was created`
        },
        {
            path: templatePath + 'helper.txt',
            dest: 'helpers/' + capitalizeFirst(name) + 'Helper.js',
            success: `The Helper class for '${chalk.bold(name)}' was created`
        }
    ]

    createFiles(files, name)
}

/**
 * Defines files used for a Controller, CRUD and route files
 * 
 * @param {string} name Resource name
 */
const createController = (name) => {
    const files = [
        {
            path: templatePath + 'controller.txt',
            dest: 'controllers/' + capitalizeFirst(name) + 'Controller.js',
            success: `The '${chalk.bold(name)}' controller structure was created`
        },
        {
            path: templatePath + 'route.txt',
            dest: 'routes/' + name.toLowerCase() + '.js',
            success: `The '${chalk.bold(name)}' route structure was created`
        },
        {
            path: templatePath + 'crud/create.txt',
            dest: 'controllers/' + capitalizeFirst(name) + '/Create' + capitalizeFirst(name) + '.js',
            success: `The '${chalk.bold(name)}' Create structure was created`
        },
        {
            path: templatePath + 'crud/update.txt',
            dest: 'controllers/' + capitalizeFirst(name) + '/Update' + capitalizeFirst(name) + '.js',
            success: `The '${chalk.bold(name)}' Update structure was created`
        },
        {
            path: templatePath + 'crud/get.txt',
            dest: 'controllers/' + capitalizeFirst(name) + '/Get' + capitalizeFirst(name) + '.js',
            success: `The '${chalk.bold(name)}' Get structure was created`
        },
        {
            path: templatePath + 'crud/delete.txt',
            dest: 'controllers/' + capitalizeFirst(name) + '/Delete' + capitalizeFirst(name) + '.js',
            success: `The '${chalk.bold(name)}' Delete structure was created`
        }
    ]

    fs.mkdir('controllers/' + capitalizeFirst(name), (err) => {
        if (err) throw err
        createFiles(files, name)
    })
}

// Initialises the cli and the available commands
program
    .version('0.0.1')
    .description('A tool to easily create a api route structure')
    .option('-m, --model <model_name>', 'Create a model')
    .option('-c, --controller <controller_name>', 'Creates a Controller, CRUD placeholders and a routes file')
    .option('-r, --resource <resource_name>', 'Creates a Model, Controller, CRUD & a routes file')
    .parse(process.argv)

// Checks user input and runs appropriate functions
if (program.model) createModel(program.model)
if (program.controller) createController(program.controller)
if (program['resource']) {
    createModel(program['resource'])
    createController(program['resource'])
}
#!/usr/bin/env node
import { program } from "commander";
import * as chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as finder from "find-package-json";
import * as Ajv from "ajv";
import jtomler from "jtomler";
import json_from_schema from "json-from-default-schema";
import * as config_schema from "./schemes/config.json";
import { ICliConfig } from "./config.interface";
 
const pkg = finder(__dirname).next().value;

let config: ICliConfig = {
    default: {}
};
let environment = "default";

program.version(`version: ${pkg.version}`, "-v, --version", "output the current version.");
program.name(pkg.name);
program.option("-c, --config <type>", "Path to config file. If not set, searching configuration in package.json file.");
program.option("-e, --environment <type>", "Environment name.", "default");

program.parse(process.argv);

if (program.config === undefined) {

    const user_pkg_full_path = path.resolve(process.cwd(), "package.json");

    if (!fs.existsSync(user_pkg_full_path)) {
        console.error(chalk.red("[ERROR] Not set configuration"));
        process.exit(1);
    }

    const user_pkg = JSON.parse(fs.readFileSync(user_pkg_full_path).toString());

    if (user_pkg.copier === undefined) {
        console.error(chalk.red("[ERROR] Not set configuration"));
        process.exit(1);
    }

    config = <ICliConfig>json_from_schema(user_pkg.copier, config_schema);
    
} else {

    const full_config_path = path.resolve(process.cwd(), program.config);

    if (!fs.existsSync(full_config_path)) {
        console.error(chalk.red(`[ERROR] Config file ${full_config_path} not found`));
        process.exit(1);
    }

    config = <ICliConfig>json_from_schema(jtomler(full_config_path), config_schema);

}

if (program.environment !== environment) {
    environment = <string>program.environment;
}

if (config[environment] === undefined) {
    console.error(chalk.red(`[ERROR] Configuration for environment ${environment} not set`));
    process.exit(1);
}

const ajv = new Ajv();
const validate = ajv.compile(config_schema);

if (!validate(config[environment])) {
    console.error(chalk.red(`[ERROR] Schema errors:\n${JSON.stringify(validate.errors, null, 2)}`));
    process.exit(1);
}

export default config[environment];

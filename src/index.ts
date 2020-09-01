#!/usr/bin/env node
import config from "./lib/entry";
import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";

for (const item of config.copy) {

    const full_from_path = path.resolve(process.cwd(), item.from);

    if (!fs.existsSync(full_from_path)) {
        console.error(chalk.red(`[ERROR] File ${full_from_path} for coping not found`));
        process.exit(1);
    }

}

const copyFile = async (from: string, to: string): Promise<void> => {

    return new Promise( (resolve) => {
        
        if (config.rewrite === false) {
            if (fs.existsSync(to)) {
                console.error(chalk.red(`[ERROR] Destination file ${to} already exist`));
                process.exit(1);
            }
        }

        const to_dirname = path.dirname(to);
    
        if (!fs.existsSync(to_dirname)) {
            fs.mkdirSync(to_dirname, {
                recursive: true
            });
        }

        const read_stream = fs.createReadStream(from);
        const write_stream = fs.createWriteStream(to);
 
        write_stream.once("close", () => {
            console.log(`${chalk.green("✔")} Copied ${chalk.grey(from)} to ${chalk.grey(to)}`);
            resolve();
        });

        write_stream.once("error", (error) => {
            console.error(`${chalk.green("✖")} Error Coping ${chalk.grey(from)}. ${error}`);
            process.exit(1);
        });
    
        read_stream.pipe(write_stream);
 
    });

};

const copyFolder = async (from: string, to: string): Promise<void> => {
  
    const files = fs.readdirSync(from);

    for (const file_path of files) {

        const full_from_path = path.resolve(from, file_path);
        const full_to_path = path.resolve(to, file_path);
        const stat = fs.statSync(full_from_path);

        if (stat.isDirectory()) {
            await copyFolder(full_from_path, full_to_path);
        } else {
            await copyFile(full_from_path, full_to_path);
        }

    }

};

const copy = async () => {
    
    for (const item of config.copy) {

        const full_from_path = path.resolve(process.cwd(), item.from);
        const full_to_path = path.resolve(process.cwd(), item.to);
        const stat = fs.statSync(full_from_path);

        if (stat.isDirectory()) {
            await copyFolder(full_from_path, full_to_path);
        } else {
            await copyFile(full_from_path, full_to_path);
        }
    
    }

};

copy();
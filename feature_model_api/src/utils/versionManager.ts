import path from "path";
import { exec } from "child_process";
import moment from "moment";
import fs from 'fs-extra';
import util from 'util';

const execPromise = util.promisify(exec);
const readdirPromise = util.promisify(fs.readdir)
const movePromise =   util.promisify(fs.move)
const removePromise = util.promisify(fs.remove)
export function getFolderName() : string{
    const date: Date = new Date();
   return 'experiment_' + moment(date).format('YYYY-MM-DD_HH-mm');
}

export async  function runJar(jarPath, options, folderPath) {
    try {
        const { stdout, stderr } = await execPromise(`java -jar ${jarPath} ${options}`, { cwd: folderPath });
        console.log(`Standard output: ${stdout}`);
        if (stderr) {
            console.error(`Errors: ${stderr}`);
        } else {
            console.log("It's GOOD");
            await organizeFiles(folderPath);
        }
    } catch (error) {
        console.error(`Execution error: ${error}`);
    }
}
    export async function organizeFiles(folderPath) {
        const sourceDir = path.join(folderPath, 'tmp');
    
        fs.readdir(sourceDir, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.error(`Error reading directory: ${err}`);
                return;
            }
            files.forEach(dirent => {
                if (dirent.isDirectory()) {
                    const subDir = path.join(sourceDir, dirent.name);
                    moveFiles(subDir, folderPath);
                }
            });
        });

      
    }
    
    async function moveFiles(src, dest) {
        try {
            const files = await readdirPromise(src, { withFileTypes: true });
            const moveOperations = files.map(async file => {
                if (file.isDirectory()) {
                    throw new Error(`${file.name} is a directory, not a file.`);
                }
                const srcPath = path.join(src, file.name);
                const destPath = path.join(dest, file.name);
                await movePromise(srcPath, destPath);
                console.log(`Moved ${file.name} to ${dest}`);
            });
    
            // Wait for all move operations to complete
            await Promise.all(moveOperations);
          
            await removePromise(path.join(dest,'tmp'));
            console.log(`Removed directory ${path.join(dest,'tmp')}`);
        } catch (err) {
            console.error(`Operation failed: ${err}`);
        }
    }



import path from "path";
import fs from 'fs';
import { exec } from "child_process";
import moment from "moment";


export function getFolderName() : string{
    const date: Date = new Date();
   return 'version_' + moment(date).format('YYYY-MM-DD_HH-mm');
}

export function runJar(jarPath: string , options : string , folderPath:string){
 
    try {
        exec(`java -jar   ${jarPath}  ${options}`, {cwd: folderPath}, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur d'exécution: ${error}`);
                return;
            }
            console.log(`Sortie standard: ${stdout}`);
            if (stderr) {
                console.error(`Erreurs: ${stderr}`);
            }
        });
    
    } catch (error) {
        console.error(`Erreur lors du changement de répertoire : ${error}`);
    }
}

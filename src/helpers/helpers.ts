import * as vscode from 'vscode';
import * as cp from 'child_process';

class OsFunc {
    static exec = (cmd:string) => {
        return new Promise((resolve, reject)=> {
           cp.exec(cmd, (error, stdout, stderr) => {
             if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
           });
       });
   };
}

interface CmdDefinition {
    exec: string | undefined,
    args: object
}

function createCmd(input:CmdDefinition) {
    let cmd = `${input.exec}`;

    Object.entries(input.args).forEach(entry => {
        let key = entry[0];
        let value = entry[1];
        cmd += ` ${key} "${value}"`;
    });
    return cmd;
}

export { createCmd, OsFunc };

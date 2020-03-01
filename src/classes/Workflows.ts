import * as cp from 'child_process';
import * as vscode from 'vscode';
import { createCmd } from '../helpers/helpers';

class CeresWorkflows {
    private map:string|undefined;
    private output:string = "mpq";
    private custom:boolean = false;
    private workspace:string|undefined;
    
     constructor() {
        this.workspace = vscode.workspace.rootPath;
    };

    build = (custom:boolean,map:string|undefined, output:"mpq"|"dir"|"script") => {
        this.map = map;
        this.output = output;
        this.custom = custom;

        let cmd = {
			exec: `cd ${this.workspace} && ceres build`,
			args: {
				"map": `${this.map}`,
				"output": this.output
			}
        };

        if (this.custom) {
            // cmd.exec = "custom";
        }

        console.log(cmd);
        
        cp.exec(createCmd(cmd), (err: any, stdout: any, stderr: any) => {
            console.log(stdout);
            console.error(stderr);
			if (err) {
				console.error("Command was not able to execute.. :(");
			};
		});
    };
}

export { CeresWorkflows };
import * as util from 'util';
import * as cp from 'child_process';
import * as vscode from 'vscode';
import { createCmd, OsFunc } from '../helpers/helpers';

class CeresWorkflows {
    private map:string = "";
    private output:string = "mpq";
    private workspacePath:string;
    private warProcess:any = null;
    
     constructor(workspacePath:string) {
        this.workspacePath = workspacePath;
    };

    // TODO: Define Custom Workflow for Build Runtime
    public async build(map:string|undefined, output:"mpq"|"dir"|"script") {
        if (map !== undefined) {
            this.map = map;
            this.output = output;

            let cmd = {
                exec: `cd "${this.workspacePath}" && ceres build`,
                args: {
                    "--":"",
                    "--map": `${this.map}`,
                    "--output": this.output
                }
            };

            //TODO: ceres-tstl --watch?
            if (vscode.workspace.getConfiguration('ceres').get('project.lang') === "ts") {
                let installPackagesCmd = `cd ${this.workspacePath} && npm install`;
                let pckgRes = await OsFunc.exec(installPackagesCmd);
                console.log(pckgRes);
                let compileCmd = `cd ${this.workspacePath} && npm run build`;
                let cmpRes = await OsFunc.exec(compileCmd);
                console.log(cmpRes);
            }
            
            let res = await OsFunc.exec(createCmd(cmd));
            console.log(res);
            // TODO: Implement Error Handling
        }
        return this;
    };

    // TODO: Define Custom Workflow for Run Runtime
    public async run(warcraftPath:string, warcraftArgs:string[]) {
        if (this.output === "script") {
            console.log('Script build cannot be run.');
            return;
        }

        if (this.map !== undefined && this.output !== undefined) {
            let autoClose = vscode.workspace.getConfiguration('ceres').get('warcraft3.game.autoclose');
            if (this.warProcess != null) {
                this.warProcess.kill();
                this.warProcess = null;
            }
            let cmd = warcraftPath;
            let args = [`-loadfile "${this.workspacePath}\\target\\${this.map}${(this.output !== "mpq") ? `.${this.output}` : ""}"`];

            warcraftArgs.forEach((arg) => {
                args.push(arg);
            });

            this.warProcess = cp.spawn(cmd, args, {detached: true, windowsVerbatimArguments:true});
            //TODO: Implement Error Handling + AutoClose Functionalities
        }
    };

    // TODO: Define Custom Workflow for Edit Runtime
    public async edit(editorPath:string, map:string|undefined, editorArgs:string[]) {
        if (map !== undefined) {
            let cmd = editorPath;
            let args = [`-loadfile "${this.workspacePath}\\maps\\${map}"`];

            editorArgs.forEach((arg) => {
                args.push(arg);
            });

            let editorProcess = cp.spawn(cmd, args, {detached: true, windowsVerbatimArguments:true});
            //TODO: Implement Error Handling
        }
    };
}

export default CeresWorkflows;
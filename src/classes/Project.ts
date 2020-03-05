import * as vscode from 'vscode';
import * as fs from 'fs';
import * as templates from '../config/templates.json';
import * as request from 'request-promise';
import { OsFunc } from '../helpers/helpers';
const filendir = require('filendir');
const AdmZip = require('adm-zip');
const Uri = vscode.Uri;

class Project {
    private projectName:string = "Default";
    private dirName:any;
    private templates:any = templates;
    private templatesKeys:string[] = [];
    private progress:any;
    private template:any;
    private workspacePath:string;

    constructor(workspacePath:string) {
        Object.keys(templates).forEach((item) => {
            this.templatesKeys.push(item);
        });
        this.workspacePath = workspacePath;
    }
    
    private async define() {
        this.projectName = await vscode.window.showInputBox({prompt:"Project Name:"}) as string; //TODO: Define types
        let templateName = await vscode.window.showQuickPick(this.templatesKeys, {placeHolder: "Project Template:"}) as string; //TODO: Define types
        this.template = this.templates[templateName];
    };

    private async request() {
        this.progress.report({ increment: 20, message: "Downloading Template from Github.." });
        try {
            let templateUrl = this.template.url;
            return await request.get({url:templateUrl, encoding: null});
        } catch (err) {
            console.log(err);
        } 
    };

    private async create() {
        let body = await this.request();
        let zip = new AdmZip(body);
        await this.progress.report({ increment: 5, message: "Loading Template..." });
        let entries = await zip.getEntries();
        this.dirName = entries[0].entryName;
        await this.progress.report({ increment: 15, message: "Unzipping Template..." });
        await zip.extractAllTo(this.workspacePath);
    };

    private async rename() {
        await this.progress.report({ increment: 5, message: "Renaming Template..." });
        try {
            await fs.promises.rename(this.workspacePath+'/'+this.dirName, this.workspacePath+'/'+this.projectName);
        } catch (err) {
            console.log(err);
        }
    };

    private async addProjectSettings() {
        if (this.template.type === "ts") {
            let content = '{\n  "ceres.project.lang": "ts"\n}';
            await this.progress.report({ increment: 5, message: "Adding VsCode Settings..." });
            await filendir.writeFileSync(this.workspacePath+'/'+this.projectName+'/.vscode/settings.json', content);
        }
    };

    private async installPackages() {
        if (this.template.type === "ts") {
            let cmd = `cd ${this.workspacePath}/${this.projectName} && npm install`;
            await this.progress.report({ increment: 30, message: "Installing Dependencies..." });
            let res = await OsFunc.exec(cmd);
            console.log(res);
            //TODO: Define Error Handle
        }
    };
    
    private openProject = async () => {
        let uri = Uri.file(`${this.workspacePath}/${this.projectName}`);
        let success = await vscode.commands.executeCommand('vscode.openFolder', uri);
        //TODO: Handle Success and Fail
    };

    public async init() {
        vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Creating Project...",
			cancellable: false
		}, async (progress:any) => {
            this.progress = progress;
            await this.define();
			await this.create();
            await this.rename();
            await this.addProjectSettings();
            await this.installPackages();
            this.progress.report({ increment: 20, message: "Project Created" });
            await this.openProject();
			return new Promise(resolve => setTimeout(resolve, 1000));
		});
    };
    
}

export default Project;
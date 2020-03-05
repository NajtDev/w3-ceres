import * as vscode from 'vscode';
import Commands from './classes/Commands';
import CeresWorkflows from './classes/Workflows';
import Project from './classes/Project';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

	let workspacePath:string = vscode.workspace.rootPath as string;

	let Ceres = new CeresWorkflows(workspacePath);

	let Cmds = new Commands(context);
	Cmds.addCommand('ceres.init', async () => {
		let project = new Project(workspacePath);
		await project.init();
	})
	.addCommand('ceres.build', async () => {
		let maps:string[] = fs.readdirSync(workspacePath+'/maps');
		let map = await vscode.window.showQuickPick(maps, {placeHolder: "Map:"});
		let output = await vscode.window.showQuickPick(["mpq", "dir", "script"], {placeHolder: "Output:"}) as "mpq"|"dir"|"script";
		Ceres.build(map, output);
	})
	.addCommand('ceres.run', async () => {
		let gamePath:string = vscode.workspace.getConfiguration('ceres').get('warcraft3.game.path') as string;
		let gameArgs:string[] = vscode.workspace.getConfiguration('ceres').get('warcraft3.game.args') as [];
		let maps:string[] = fs.readdirSync(workspacePath+'/maps');
		let map = await vscode.window.showQuickPick(maps, {placeHolder: "Map:"});
		let output = await vscode.window.showQuickPick(["mpq", "dir", "script"], {placeHolder: "Output:"}) as "mpq"|"dir"|"script";
		(await Ceres.build(map, output)).run(gamePath, gameArgs);
	})
	.addCommand('ceres.edit', async () => {
		let editorPath:string = vscode.workspace.getConfiguration('ceres').get('warcraft3.editor.path') as string;
		let editorArgs:string[] = vscode.workspace.getConfiguration('ceres').get('warcraft3.editor.args') as [];
		let maps:string[] = fs.readdirSync(workspacePath+'/maps');
		let map = await vscode.window.showQuickPick(maps, {placeHolder: "Map:"});
		Ceres.edit(editorPath, map, editorArgs);
	});

	Cmds.subscribe();

}

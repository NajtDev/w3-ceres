import * as vscode from 'vscode';
import Commands from './classes/Commands';
import { CeresWorkflows } from './classes/Workflows';
import { commandMode } from './helpers/helpers';

export function activate(context: vscode.ExtensionContext) {

	let Ceres = new CeresWorkflows();

	let Cmds = new Commands(context);
	Cmds.addCommand('ceres.init', async () => {
		console.log('init');
	})
	.addCommand('ceres.build', async () => {
		let map = await vscode.window.showInputBox({prompt:"Map name:"});
		let output = await vscode.window.showQuickPick(["mpq", "dir", "script"], {placeHolder: "Output:"}) as "mpq"|"dir"|"script";
		Ceres.build(commandMode(), map, output);
	})
	.addCommand('ceres.run', () => {
		console.log('run');
	})
	.addCommand('ceres.edit', () => {
		console.log('edit');
	});

	Cmds.subscribe();

}

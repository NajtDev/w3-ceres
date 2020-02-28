import * as vscode from 'vscode';
import Commands from './classes/Commands';
import commandMode from './helpers/commandMode';

export function activate(context: vscode.ExtensionContext) {

	let Cmds = new Commands(context);
	Cmds.addCommand('ceres.init', () => {
		console.log('ceres initialised');
		console.log(commandMode());
	})
	.addCommand('ceres.build', () => {
		console.log('ceres build');
	});

	Cmds.subscribe();

}

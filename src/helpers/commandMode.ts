import * as vscode from 'vscode';

const commandMode: () => boolean = () => {
    return vscode.workspace.getConfiguration('ceres').get('commands.mode') === "custom";
}

export default commandMode;
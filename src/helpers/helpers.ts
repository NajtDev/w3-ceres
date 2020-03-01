import * as vscode from 'vscode';

const commandMode: () => boolean = () => {
    return vscode.workspace.getConfiguration('ceres').get('commands.mode') === "custom";
};

interface CmdDefinition {
    exec: string | undefined,
    args: object
}

function createCmd(input:CmdDefinition) {
    let cmd = `${input.exec} --`;

    Object.entries(input.args).forEach(entry => {
        let key = entry[0];
        let value = entry[1];
        cmd += ` --${key} "${value}"`;
    });
    return cmd;
}

export { createCmd, commandMode };

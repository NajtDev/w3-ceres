import * as vscode from 'vscode';

class Commands {
    context: vscode.ExtensionContext;
    list: Array<vscode.Disposable>;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.list = [];
    }

    addCommand = (command: string, cb: () => void) => {
        this.list.push(vscode.commands.registerCommand(command, cb));
        return this;
    };

    subscribe = () => {
        this.list.forEach(disposable => this.context.subscriptions.push(disposable));
    };

}

export default Commands;
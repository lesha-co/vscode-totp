import { ExtensionContext, commands } from "vscode";
import { totpPick } from "./commands/pick";
import { Command } from "./commands";
import { totpNew } from "./commands/new";
import { makeStatusBarItem } from "./makeStatusBarItem";
import { totpBackup } from "./commands/backup";
import { totpRestore } from "./commands/restore";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(Command.NEW, () => totpNew(context)),
    commands.registerCommand(Command.PICK, () => totpPick(context)),
    commands.registerCommand(Command.BACKUP, () => totpBackup(context)),
    commands.registerCommand(Command.RESTORE, () => totpRestore(context)),
    makeStatusBarItem()
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

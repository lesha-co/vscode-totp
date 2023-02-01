import { ExtensionContext, commands } from "vscode";
import { functions } from "./commands";
import { makeStatusBarItem } from "./makeStatusBarItem";

export function activate(context: ExtensionContext) {
  for (const key in functions) {
    context.subscriptions.push(
      commands.registerCommand(key, () => functions[key](context))
    );
  }
  context.subscriptions.push(makeStatusBarItem());
}

// this method is called when your extension is deactivated
export function deactivate() {}

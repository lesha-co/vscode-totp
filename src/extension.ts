// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getCodeByName, getInfo, getNames, addCode } from "./store";
import { addTOTP } from "./addTOTP";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const makeStatusBarItem = (context: vscode.ExtensionContext) => {
  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(myStatusBarItem);

  myStatusBarItem.show();
  myStatusBarItem.text = "$(key)";
  return myStatusBarItem;
};

export function activate(context: vscode.ExtensionContext) {
  const myCommandId = "sample.showCode";
  context.subscriptions.push(
    vscode.commands.registerCommand(myCommandId, async () => {
      const EDIT = "Edit";
      const r: string | undefined = await vscode.window.showInformationMessage(
        "Select code",
        ...getNames(),
        EDIT
      );

      if (r === undefined) {
        return;
      }
      if (r !== EDIT) {
        const code = getCodeByName(r);
        if (code) {
          const result = getInfo(code);
          vscode.window.showInputBox({
            value: result.code,
            prompt: "Copy this to clipboard"
          });
          return;
        }
      }
      const code = await addTOTP(context);
      addCode(code);
    })
  );

  const myStatusBarItem = makeStatusBarItem(context);
  myStatusBarItem.command = myCommandId;
}

// this method is called when your extension is deactivated
export function deactivate() {}

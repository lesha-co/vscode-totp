import * as vsc from "vscode";
import { getInfo, addCode } from "./store";
import { addTOTP } from "./addTOTP";
import { data } from "./store/data";
import { pickOTPService } from "./pickOTP";
const COMMAND = "totp.pick";
const makeStatusBarItem = (context: vsc.ExtensionContext) => {
  const myStatusBarItem = vsc.window.createStatusBarItem(
    vsc.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(myStatusBarItem);

  myStatusBarItem.show();
  myStatusBarItem.text = "$(key)";
  return myStatusBarItem;
};

export function activate(context: vsc.ExtensionContext) {
  context.subscriptions.push(
    vsc.commands.registerCommand(COMMAND, async () => {
      try {
        const result = await pickOTPService(data);

        if (result.button) {
          const code = await addTOTP(context);
          addCode(code);
        } else {
          const info = getInfo(result.data);
          vsc.window.showInputBox({
            value: info.code,
            prompt: "Copy this to clipboard",
          });
        }
      } catch (x) {
        // debugger;
      }
    })
  );

  const myStatusBarItem = makeStatusBarItem(context);
  myStatusBarItem.command = COMMAND;
}

// this method is called when your extension is deactivated
export function deactivate() {}

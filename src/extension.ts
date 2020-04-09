import * as vsc from "vscode";
import { getInfo } from "./store";
import { addTOTP } from "./addTOTP";
import { data } from "./store/data";
import { pickOTPService } from "./pickOTP";
import { addCode, getCodes, merge } from "./store/context";

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
  merge(context, data);
  context.subscriptions.push(
    vsc.commands.registerCommand(COMMAND, async () => {
      try {
        const ctxCodes = getCodes(context);
        const result = await pickOTPService(ctxCodes);

        if (result.button) {
          const code = await addTOTP(context);
          addCode(context, code);
        } else {
          const info = getInfo(result.data);
          vsc.env.clipboard.writeText(info.code);
          vsc.window.showInformationMessage("Password copied to clipboard");
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

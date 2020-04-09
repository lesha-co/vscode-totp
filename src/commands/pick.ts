import { ExtensionContext, commands, env, window } from "vscode";
import { getCodes } from "../store/context";
import { pickOTPService } from "../pickOTP";
import { getInfo } from "../store/index";
import { Command } from "../commands";
export const totpPick = async (context: ExtensionContext) => {
  try {
    const ctxCodes = getCodes(context);
    const result = await pickOTPService(ctxCodes);

    if (result.button) {
      commands.executeCommand(Command.NEW);
    } else {
      const info = getInfo(result.data);
      env.clipboard.writeText(info.code);
      window.showInformationMessage("Password copied to clipboard");
    }
  } catch (x) {
    // debugger;
  }
};

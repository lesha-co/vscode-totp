import { ExtensionContext, commands, env, window } from "vscode";
import { getCodes } from "../store/context";
import { pickOTPService } from "../pickOTP";
import { getInfo } from "../store/index";
import { Command } from "../commands";
import { addButton, editButton, restoreButton, backupButton } from "../buttons";
export const totpPick = async (context: ExtensionContext) => {
  try {
    const ctxCodes = getCodes(context);
    const result = await pickOTPService(ctxCodes);

    if (result.button) {
      switch (result.data) {
        case addButton: {
          await commands.executeCommand(Command.NEW);
          break;
        }
        case editButton: {
          await commands.executeCommand(Command.EDIT);
          break;
        }
        case restoreButton: {
          await commands.executeCommand(Command.RESTORE);
          break;
        }
        case backupButton: {
          await commands.executeCommand(Command.BACKUP);
          break;
        }
      }
    } else {
      const info = getInfo(result.data);
      env.clipboard.writeText(info.code);
      window.showInformationMessage("Password copied to clipboard");
    }
  } catch (x) {
    // debugger;
  }
};

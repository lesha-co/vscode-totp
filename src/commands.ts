import { ExtensionContext } from "vscode";
import * as cmd from "./commands/index";

export enum Command {
  PICK = "totp.pick",
  BACKUP = "totp.backup",
  RESTORE = "totp.restore",
  EDIT = "totp.edit",
  CLEAR = "totp.clear",
  NEW = "totp.new",
}

export const functions: Record<
  string,
  (context: ExtensionContext) => Promise<void>
> = {
  [Command.NEW]: cmd.totpNew,
  [Command.PICK]: cmd.totpPick,
  [Command.BACKUP]: cmd.totpBackup,
  [Command.RESTORE]: cmd.totpRestore,
  [Command.EDIT]: cmd.totpEdit,
  [Command.CLEAR]: cmd.totpClear,
};

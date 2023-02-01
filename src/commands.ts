import { ExtensionContext } from "vscode";
import * as cmd from "./commands/index";

export enum Command {
  pick = "totp.pick",
  backup = "totp.backup",
  restore = "totp.restore",
  edit = "totp.edit",
  clear = "totp.clear",
  new = "totp.new",
}

export const functions: Record<
  string,
  (context: ExtensionContext) => Promise<void>
> = {
  [Command.new]: cmd.totpNew,
  [Command.pick]: cmd.totpPick,
  [Command.backup]: cmd.totpBackup,
  [Command.restore]: cmd.totpRestore,
  [Command.edit]: cmd.totpEdit,
  [Command.clear]: cmd.totpClear,
};

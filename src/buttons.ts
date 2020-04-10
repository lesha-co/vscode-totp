import { QuickInputButton, ThemeIcon } from "vscode";

export const addButton: QuickInputButton = {
  iconPath: new ThemeIcon("add"),
  tooltip: "Add new OTP",
};

export const editButton: QuickInputButton = {
  iconPath: new ThemeIcon("edit"),
  tooltip: "Edit OTP",
};
export const backupButton: QuickInputButton = {
  iconPath: new ThemeIcon("save"),
  tooltip: "Backup codes",
};
export const restoreButton: QuickInputButton = {
  iconPath: new ThemeIcon("folder-opened"),
  tooltip: "Restore from backup",
};

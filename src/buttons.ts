import { QuickInputButton, ThemeIcon } from "vscode";

export const addButton: QuickInputButton = {
  iconPath: new ThemeIcon("add"),
  tooltip: "Add new OTP",
};

export const deleteButton: QuickInputButton = {
  iconPath: new ThemeIcon("trash"),
  tooltip: "Delete OTP",
};
export const backupButton: QuickInputButton = {
  iconPath: new ThemeIcon("save"),
  tooltip: "Backup codes",
};
export const restoreButton: QuickInputButton = {
  iconPath: new ThemeIcon("folder-opened"),
  tooltip: "Restore from backup",
};

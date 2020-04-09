import { ExtensionContext, window, StatusBarAlignment } from "vscode";
import { Command } from "./commands";
export const makeStatusBarItem = () => {
  const myStatusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Right,
    100
  );

  myStatusBarItem.show();
  myStatusBarItem.text = "$(key)";
  myStatusBarItem.command = Command.PICK;
  return myStatusBarItem;
};

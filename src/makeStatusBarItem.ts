import { StatusBarAlignment } from "vscode";
import { Command } from "./commands";
import { sideEffects } from "./external";
export const makeStatusBarItem = () => {
  const myStatusBarItem = sideEffects.createStatusBarItem(
    StatusBarAlignment.Right,
    100
  );

  myStatusBarItem.show();
  myStatusBarItem.text = "$(key)";
  myStatusBarItem.command = Command.pick;
  return myStatusBarItem;
};

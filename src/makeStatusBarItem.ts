import { StatusBarAlignment } from "vscode";
import { Command } from "./commands";
import * as ui from "./ui";
export const makeStatusBarItem = () => {
  const myStatusBarItem = ui.createStatusBarItem(StatusBarAlignment.Right, 100);

  myStatusBarItem.show();
  myStatusBarItem.text = "$(key)";
  myStatusBarItem.command = Command.pick;
  return myStatusBarItem;
};

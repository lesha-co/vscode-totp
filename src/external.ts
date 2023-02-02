import { window, workspace, env, commands } from "vscode";

/**
 * Every side effect is gathered here
 * I can mock these functions during testing in order to control environment:
 *  - picking an item when extensions calls showQuickPick
 *  - providing predefined timestamp to test OTP (I don't actually need to test
 *    OTP that much because simple-totp has its own tests)
 * this
 * https://juanmanuelalloron.com/2020/05/05/testing-vscode-extensions-with-cypress-and-code-server/
 * is more robust I guess
 */
export const sideEffects = {
  // window
  showInputBox: window.showInputBox,
  showQuickPick: window.showQuickPick,
  createQuickPick: window.createQuickPick,
  showTextDocument: window.showTextDocument,
  createStatusBarItem: window.createStatusBarItem,
  showInformationMessage: window.showInformationMessage,
  showOpenDialog: window.showOpenDialog,
  showErrorMessage: window.showErrorMessage,
  //workspace
  openTextDocument: workspace.openTextDocument,
  fsReadFile: workspace.fs.readFile,
  //etc
  writeClipboard: env.clipboard.writeText,
  executeCommand: commands.executeCommand,
  timestamp: () => Date.now(),
};

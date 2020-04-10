import {
  ExtensionContext,
  window,
  QuickPickItem,
  Disposable,
  commands,
} from "vscode";
import { getCodes, replaceCode, deleteCode } from "../store/context";
import { Result } from "../pickOTP";
import { Code } from "../store/index";
import { Command } from "../commands";

export const pickForEdit = async (data: Code[]): Promise<Result<Code>> => {
  return await new Promise((resolve, reject) => {
    const disposables: Disposable[] = [];
    const dispose = () => disposables.forEach((it) => it.dispose());
    type Item = QuickPickItem & { code: Code };
    const items: Item[] = data.map((code) => ({
      code: code,
      label: code.name,
    }));

    const qp = window.createQuickPick<Item>();
    disposables.push(qp);
    qp.title = "Select item to edit";
    qp.items = items;

    disposables.push(
      qp.onDidChangeSelection((items) => {
        const data = items[0].code;
        resolve({ button: false, data });
        dispose();
      }),
      qp.onDidHide(() => {
        dispose();
        reject();
      })
    );
    qp.show();
  });
};
export const deleteRoutine = async (context: ExtensionContext, code: Code) => {
  const confirmation = await window.showInputBox({
    placeHolder: `Please type "${code.name} to confirm deletion"`,
    prompt: `Before deleting this account, make sure that you have other means of generating codes for it`,
  });
  if (confirmation === "yes") {
    deleteCode(context, code.name);
  }
};
export const renameRoutine = async (context: ExtensionContext, code: Code) => {
  const newName = await window.showInputBox({
    prompt: `Enter new name for ${code.name}`,
    value: code.name,
  });
  if (newName === undefined) {
    return;
  }
  replaceCode(context, code.name, { ...code, name: newName });
};
export const totpEdit = async (context: ExtensionContext) => {
  try {
    const data = getCodes(context);
    const entry = await pickForEdit(data);
    if (entry.button) {
      return;
    }
    const code = entry.data;
    const RENAME = { label: "Rename" };
    const DELETE = { label: "Delete" };
    const result = await window.showQuickPick([RENAME, DELETE]);
    if (!result) {
      return;
    }
    if (result === RENAME) {
      await renameRoutine(context, code);
    }
    if (result === DELETE) {
      await deleteRoutine(context, code);
    }

    await commands.executeCommand(Command.PICK);
  } catch (x) {
    // debugger;
  }
};

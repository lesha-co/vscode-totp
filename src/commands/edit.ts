import { ExtensionContext, QuickPickItem, Disposable, commands } from "vscode";
import * as ui from "../ui";
import { replaceCode, deleteCode } from "../store/context";
import { Result } from "./pick";
import { Code } from "../store/index";
import { Command } from "../commands";
import { auto } from "../store/versions/auto";

export const pickForEdit = async (data: Code[]): Promise<Result<Code>> => {
  return await new Promise((resolve, reject) => {
    const disposables: Disposable[] = [];
    const dispose = () => disposables.forEach((it) => it.dispose());
    type Item = QuickPickItem & { code: Code };
    const items: Item[] = data.map((code) => ({
      code: code,
      label: code.name,
    }));

    const qp = ui.createQuickPick<Item>();
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
  const confirmation = await ui.showInputBox({
    placeHolder: `Please type "${code.name}" to confirm deletion`,
    prompt: `Before deleting this account, make sure that you have other means of generating codes for it`,
    validateInput: (value) => {
      if (value === code.name) {
        return null;
      }
      return `Please type "${code.name}" to confirm deletion`;
    },
  });
  if (confirmation === code.name) {
    await deleteCode(context, code.name);
  }
};
export const renameRoutine = async (context: ExtensionContext, code: Code) => {
  const newName = await ui.showInputBox({
    prompt: `Enter new name for ${code.name}`,
    value: code.name,
  });
  if (newName === undefined) {
    return;
  }
  await replaceCode(context, code.name, { ...code, name: newName });
};
export const totpEdit = async (context: ExtensionContext) => {
  try {
    const data = await auto.loadFromState(context);
    const entry = await pickForEdit(data);
    if (entry.button) {
      return;
    }
    const code = entry.data;
    const RENAME = { label: "Rename" };
    const DELETE = { label: "Delete" };
    const result = await ui.showQuickPick([RENAME, DELETE]);
    if (!result) {
      return;
    }
    if (result === RENAME) {
      await renameRoutine(context, code);
    }
    if (result === DELETE) {
      await deleteRoutine(context, code);
    }

    await commands.executeCommand(Command.pick);
  } catch (x) {
    // debugger;
  }
};

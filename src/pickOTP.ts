import { Code } from "./store/index";
import { window, QuickInputButton, QuickPickItem, Disposable } from "vscode";
import {
  addButton,
  deleteButton,
  backupButton,
  restoreButton,
} from "./buttons";

type Result<TItem> =
  | { button: true; data: QuickInputButton }
  | { button: false; data: TItem };

export const pickOTPService = async (data: Code[]): Promise<Result<Code>> =>
  await new Promise((resolve, reject) => {
    const disposables: Disposable[] = [];
    const dispose = () => disposables.forEach((it) => it.dispose());
    type Item = QuickPickItem & { code: Code };
    const items: Item[] = data.map((code) => ({
      code: code,
      label: code.name,
    }));

    const qp = window.createQuickPick<Item>();
    disposables.push(qp);
    qp.title = "OTP Generator";
    qp.items = items;
    qp.buttons = [addButton, deleteButton, backupButton, restoreButton];
    disposables.push(
      qp.onDidChangeSelection((items) => {
        const data = items[0].code;
        resolve({ button: false, data });
        dispose();
      }),
      qp.onDidTriggerButton((btn) => {
        resolve({ button: true, data: btn });
        dispose();
      }),
      qp.onDidHide(() => {
        dispose();
        reject();
      })
    );
    qp.show();
  });

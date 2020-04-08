import { Code } from "./store/index";
import * as vsc from "vscode";

const addButton: vsc.QuickInputButton = {
  iconPath: new vsc.ThemeIcon("add"),
  tooltip: "Add new OTP",
};

type Result<TItem> =
  | { button: true; data: vsc.QuickInputButton }
  | { button: false; data: TItem };

export const pickOTPService = async (data: Code[]): Promise<Result<Code>> =>
  await new Promise((resolve, reject) => {
    const disposables: vsc.Disposable[] = [];
    const dispose = () => disposables.forEach((it) => it.dispose());
    type Item = vsc.QuickPickItem & { code: Code };
    const items: Item[] = data.map((code) => ({
      code: code,
      label: code.name,
    }));

    const qp = vsc.window.createQuickPick<Item>();
    disposables.push(qp);
    qp.title = "OTP Generator";
    qp.items = items;
    qp.buttons = [addButton];
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

import {
  QuickInputButton,
  QuickPickItem,
  Disposable,
  ExtensionContext,
} from "vscode";
import { sideEffects } from "../external";
import { getInfo } from "../store/index";
import { Command } from "../commands";
import { auto } from "../store/versions/auto";
import { Code } from "../store/index";
import { addButton, editButton, backupButton, restoreButton } from "../buttons";

export type Result<TItem> =
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

    const qp = sideEffects.createQuickPick<Item>();
    disposables.push(qp);
    qp.title = "OTP Generator";
    qp.items = items;
    qp.buttons = [addButton, editButton, backupButton, restoreButton];
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

export const totpPick = async (context: ExtensionContext) => {
  try {
    const ctxCodes = await auto.loadFromState(context);
    const result = await pickOTPService(ctxCodes);

    if (result.button) {
      switch (result.data) {
        case addButton: {
          await sideEffects.executeCommand(Command.new);
          break;
        }
        case editButton: {
          await sideEffects.executeCommand(Command.edit);
          break;
        }
        case restoreButton: {
          await sideEffects.executeCommand(Command.restore);
          break;
        }
        case backupButton: {
          await sideEffects.executeCommand(Command.backup);
          break;
        }
      }
    } else {
      const info = getInfo(result.data);
      sideEffects.writeClipboard(info.code);
      sideEffects.showInformationMessage("Passphrase copied to clipboard");
    }
  } catch (x) {
    // debugger;
  }
};

import { ExtensionContext } from "vscode";
import { addTOTP } from "../addTOTP";
import { addCode } from "../store/context";
export const totpNew = async (context: ExtensionContext) => {
  const code = await addTOTP(context);
  addCode(context, code);
};

import { PassphraseGetter } from "./context";
import * as ui from "../ui";
export const makePasswordCache: () => PassphraseGetter = () => {
  let passphrase: string | null = null;
  return async () => {
    if (passphrase) {
      return passphrase;
    }

    const input = await ui.showInputBox({
      prompt: "Enter passphrase to unlock OTP storage",
      password: true,
    });

    if (input) {
      passphrase = input;
    }

    return passphrase;
  };
};

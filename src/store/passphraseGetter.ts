import { PassphraseGetter } from "./context";
import { sideEffects } from "../external";
export const makePasswordCache: () => PassphraseGetter = () => {
  let passphrase: string | null = null;
  return async () => {
    if (passphrase) {
      return passphrase;
    }

    const input = await sideEffects.showInputBox({
      prompt: "Enter passphrase to unlock OTP storage",
      password: true,
    });

    if (input) {
      passphrase = input;
    }

    return passphrase;
  };
};

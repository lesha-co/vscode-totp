import { sideEffects } from "../external";

export class PassphraseGetterClass {
  private passphrase: string | null = null;
  private prompt: string;
  private timeout?: number;
  private timeoutID?: ReturnType<typeof setTimeout>;

  constructor(prompt: string, timeout?: number) {
    this.prompt = prompt;
    this.timeout = timeout;
  }
  async get(): Promise<string | undefined> {
    if (this.passphrase) {
      return this.passphrase;
    }
    const input = await sideEffects.showInputBox({
      prompt: this.prompt,
      password: true,
    });

    if (input) {
      this.passphrase = input;
      console.log("passphrase saved");
      if (this.timeoutID) {
        clearTimeout(this.timeoutID);
        console.log("aborted scheduled passphrase deletion");
      }
      if (this.timeout) {
        this.timeoutID = setTimeout(() => {
          this.timeoutID = undefined;
          this.reset();
        }, this.timeout);
        console.log("scheduled to delete passphrase");
      }
    }
    return input;
  }
  reset() {
    this.passphrase = null;
    console.log("passphrase cleared");
  }
}

export const otpPasswordGetter = new PassphraseGetterClass(
  "Enter passphrase to unlock OTP storage"
);

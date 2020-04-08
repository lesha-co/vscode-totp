import { QuickPickItem, ExtensionContext, window } from "vscode";
import { base32decode } from "simple-totp";
import { Code } from "./store/index";

enum AdditionalEncodings {
  BASE_32 = "base32",
  OTPAUTH_URI = "otpauth:// TOTP key",
}

interface State {
  encoding: BufferEncoding | AdditionalEncodings;
  key: Buffer;
  T0: number;
  TX: number;
  nDigits: number;
  prefix: string;
  name: string;
  needCustomParams: boolean;
}

type PartialStateResolver = (
  s: Partial<State>
) => Promise<Partial<State>> | Partial<State>;

const isFullState = (s: Partial<State>): s is State => {
  if (s.T0 === undefined) {
    return false;
  }
  if (s.TX === undefined) {
    return false;
  }
  if (s.encoding === undefined) {
    return false;
  }
  if (s.key === undefined) {
    return false;
  }
  if (s.nDigits === undefined) {
    return false;
  }
  if (s.name === undefined) {
    return false;
  }
  if (s.prefix === undefined) {
    return false;
  }
  if (s.needCustomParams === undefined) {
    return false;
  }
  return true;
};

const findNextStep = (s: Partial<State>): PartialStateResolver | null => {
  if (s.encoding === undefined) {
    return askForEncoding;
  }
  if (s.key === undefined) {
    return askForCode;
  }
  if (s.T0 === undefined || s.TX === undefined || s.nDigits === undefined) {
    if (s.needCustomParams === true) {
      return askForCustomParams;
    }
    return askForParameters;
  }
  if (s.name === undefined) {
    return askForName;
  }
  if (s.prefix === undefined) {
    return askForPrefix;
  }
  return null;
};

const askForEncoding = async (
  state: Partial<State>
): Promise<Partial<State>> => {
  const encodings = [
    { label: AdditionalEncodings.BASE_32 },
    { label: "hex" },
    { label: "ascii" },
    { label: AdditionalEncodings.OTPAUTH_URI },
  ];
  const pick = await window.showQuickPick(encodings, {
    placeHolder: "Which encoding does your seed have",
  });
  return { ...state, encoding: pick?.label as State["encoding"] | undefined };
};

const askForParameters = async (
  state: Partial<State>
): Promise<Partial<State>> => {
  const defaultParams = Symbol();
  const customParams = Symbol();
  type TItem = QuickPickItem & { id: symbol };
  const items: TItem[] = [
    {
      id: defaultParams,
      label: "Use default parameters",
      description: "T₀ = 0, 30 seconds interval, 6 digits",
      detail: "T₀ = 0, 30 seconds interval, 6 digits",
    },
    { label: "Custom parameters...", id: customParams },
  ];

  const pick = await window.showQuickPick(items, {
    placeHolder: "Optional parameters",
  });

  if (pick === undefined) {
    return state;
  }
  if (pick.id === defaultParams) {
    return { ...state, T0: 0, TX: 30, nDigits: 6, needCustomParams: false };
  }
  return { ...state, needCustomParams: true };
};

const askForName = async (state: Partial<State>): Promise<Partial<State>> => {
  const name = await window.showInputBox({
    prompt: "Name of token",
    placeHolder: "Name of token",
    ignoreFocusOut: true,
  });
  return { ...state, name };
};

const askForPrefix = async (state: Partial<State>): Promise<Partial<State>> => {
  const prefix = await window.showInputBox({
    prompt: "prefix of token",
    placeHolder: "prefix",
    ignoreFocusOut: true,
  });
  return { ...state, prefix };
};

const askForCustomParams = async (
  state: Partial<State>
): Promise<Partial<State>> => {
  const _T0 = await window.showInputBox({
    placeHolder: "Initial timestamp",
    value: "0",
    ignoreFocusOut: true,
  });
  const _TX = await window.showInputBox({
    placeHolder: "Interval length (seconds)",
    value: "30",
    ignoreFocusOut: true,
  });
  const _nDigits = await window.showInputBox({
    placeHolder: "Interval length (seconds)",
    value: "6",
    ignoreFocusOut: true,
  });

  return {
    ...state,
    T0: _T0 ? parseInt(_T0, 10) : undefined,
    TX: _TX ? parseInt(_TX, 10) : undefined,
    nDigits: _nDigits ? parseInt(_nDigits, 10) : undefined,
  };
};

const askForCode = async (state: Partial<State>): Promise<Partial<State>> => {
  const getPlaceholder = () => {
    if (state.encoding === AdditionalEncodings.OTPAUTH_URI) {
      return "otpauth://";
    }
  };

  const decode = (v: string) => {
    switch (state.encoding) {
      case AdditionalEncodings.BASE_32:
        return base32decode(v.toUpperCase());
      case AdditionalEncodings.OTPAUTH_URI:
        throw new Error("No decoder");
      case "hex":
        const allCharacters = /^[0-9a-h]+$/i.test(v);
        const charCount = v.length % 2 === 0;
        if (!allCharacters) {
          throw new Error(
            "Check that all characters are in 0-9,a-h range (case insensitive)"
          );
        }
        if (!charCount) {
          throw new Error("Input length is uneven");
        }
        return Buffer.from(v, "hex");
      case "ascii":
        const buf = Buffer.from(v, "ascii");
        if (buf.toString("ascii") !== v) {
          throw new Error("Not all characters are in ascii range");
        }
        return buf;
      default:
        throw new Error("Encoding is undefined");
    }
  };
  const key = await window.showInputBox({
    prompt: "Paste your code",
    placeHolder: getPlaceholder(),
    ignoreFocusOut: true,
    validateInput: (v) => {
      try {
        decode(v);
      } catch (error) {
        return error.message;
      }
    },
  });
  if (key !== undefined) {
    return { ...state, key: decode(key) };
  }
  throw new Error("Key is undefined");
};

export async function addTOTP(context: ExtensionContext) {
  async function collectInputs() {
    let state = {};

    while (!isFullState(state)) {
      const step = findNextStep(state);
      if (step === null) {
        throw new Error("no steps");
      }
      state = await step(state);
    }

    return state;
  }

  const state = await collectInputs();
  const code: Code = {
    name: state.name,
    secret: state.key.toString("hex"),
    type: "hex",
    prefix: state.prefix,
    T0: state.T0,
    // state.TX is in seconds, Code['TX'] is in milliseconds
    TX: state.TX * 1000,
    nDigits: state.nDigits,
  };
  window.showInformationMessage(`Creating Application Service '${state.name}'`);
  return code;
}

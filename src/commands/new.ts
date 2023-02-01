import { QuickPickItem, ExtensionContext } from "vscode";
import { Code } from "../store/index";
import { addCode } from "../store/context";
import { base32_to_u8a, u8a_to_hex } from "simple-totp/dist/converters";
import * as ui from "../ui";
enum AdditionalEncodings {
  base32 = "base32",
  otpAuthURI = "otpauth:// TOTP key",
}

interface State {
  encoding: BufferEncoding | AdditionalEncodings;
  key: Uint8Array;
  t0: number;
  tx: number;
  nDigits: number;
  prefix: string;
  name: string;
  needCustomParams: boolean;
}

type PartialStateResolver = (
  s: Partial<State>
) => Promise<Partial<State>> | Partial<State>;

const isFullState = (s: Partial<State>): s is State => {
  if (s.t0 === undefined) {
    return false;
  }
  if (s.tx === undefined) {
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
  if (s.t0 === undefined || s.tx === undefined || s.nDigits === undefined) {
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
    { label: AdditionalEncodings.base32 },
    { label: "hex" },
    { label: "ascii" },
    { label: AdditionalEncodings.otpAuthURI },
  ];
  const pick = await ui.showQuickPick(encodings, {
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

  const pick = await ui.showQuickPick(items, {
    placeHolder: "Optional parameters",
  });

  if (pick === undefined) {
    return state;
  }
  if (pick.id === defaultParams) {
    return { ...state, t0: 0, tx: 30, nDigits: 6, needCustomParams: false };
  }
  return { ...state, needCustomParams: true };
};

const askForName = async (state: Partial<State>): Promise<Partial<State>> => {
  const name = await ui.showInputBox({
    prompt: "Name of token",
    placeHolder: "Name of token",
    ignoreFocusOut: true,
  });
  return { ...state, name };
};

const askForPrefix = async (state: Partial<State>): Promise<Partial<State>> => {
  const prefix = await ui.showInputBox({
    prompt: "prefix of token",
    placeHolder: "prefix",
    ignoreFocusOut: true,
  });
  return { ...state, prefix };
};

const askForCustomParams = async (
  state: Partial<State>
): Promise<Partial<State>> => {
  const _T0 = await ui.showInputBox({
    placeHolder: "Initial timestamp",
    value: "0",
    ignoreFocusOut: true,
  });
  const _TX = await ui.showInputBox({
    placeHolder: "Interval length (seconds)",
    value: "30",
    ignoreFocusOut: true,
  });
  const _nDigits = await ui.showInputBox({
    placeHolder: "Interval length (seconds)",
    value: "6",
    ignoreFocusOut: true,
  });

  return {
    ...state,
    t0: _T0 ? parseInt(_T0, 10) : undefined,
    tx: _TX ? parseInt(_TX, 10) : undefined,
    nDigits: _nDigits ? parseInt(_nDigits, 10) : undefined,
  };
};

const askForCode = async (state: Partial<State>): Promise<Partial<State>> => {
  const getPlaceholder = () => {
    if (state.encoding === AdditionalEncodings.otpAuthURI) {
      return "otpauth://";
    }
  };

  const decode = (v: string): Uint8Array => {
    switch (state.encoding) {
      case AdditionalEncodings.base32:
        return base32_to_u8a(v.toUpperCase());
      case AdditionalEncodings.otpAuthURI:
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
  const key = await ui.showInputBox({
    prompt: "Paste your code",
    placeHolder: getPlaceholder(),
    ignoreFocusOut: true,
    validateInput: (v) => {
      try {
        decode(v);
      } catch (error) {
        return (error as Error).message;
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
    secret: u8a_to_hex(state.key),
    type: "hex",
    prefix: state.prefix,
    t0: state.t0,
    // state.TX is in seconds, Code['TX'] is in milliseconds
    tx: state.tx * 1000,
    nDigits: state.nDigits,
  };
  ui.showInformationMessage(`Creating Application Service '${state.name}'`);
  return code;
}

export const totpNew = async (context: ExtensionContext) => {
  const code = await addTOTP(context);
  addCode(context, code);
};

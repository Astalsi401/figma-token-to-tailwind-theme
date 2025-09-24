type ColorToken = {
  $type: "color";
  $value: string;
};

type GradientToken = {
  $type: "gradient";
  $value: {
    type: string;
    angle: number;
    stops: {
      color: string;
      position: number;
    }[];
  };
};

export type FigmaToken = ColorToken | GradientToken;
export type FigmaTokenTree = { [key: string]: FigmaToken | FigmaTokenTree };

const prefix = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_\(main\)|\{|\}/g, "")
    .replace(/\.|_/g, "-");
};

const valueIsPath = (value: string) => value.includes(".");

const tokenTypeToCssProperty = (
  key: string,
  token: FigmaToken | FigmaTokenTree,
  cssOutput: Map<string, string>
): void => {
  if (typeof token.$type === "string") {
    switch (token.$type) {
      case "color":
        cssOutput.set(
          `--color${prefix(key)}`,
          valueIsPath(token.$value)
            ? `var(--color-${prefix(token.$value)})`
            : token.$value
        );
        break;
      default:
        console.log(`Unsupported token type: `, { key, token });
        break;
    }
  } else {
    Object.entries(token).forEach(([childKey, childToken]) => {
      return tokenTypeToCssProperty(
        `${key}-${childKey}`,
        childToken,
        cssOutput
      );
    });
  }
};

export const tokensToCss = (tokens: FigmaTokenTree) => {
  const cssOutput = new Map<string, string>();
  tokenTypeToCssProperty("", tokens, cssOutput);

  return Object.entries(Object.fromEntries(cssOutput)).reduce(
    (acc, [k, v]) => acc + `${k}: ${v};\n`,
    ""
  );
};

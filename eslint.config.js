import eslint from "@eslint/js";
import tseslint from "typescript-eslint"

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    rules: {
      "@typescript-eslint/no-this-alias": 0,
      "@typescript-eslint/class-literal-property-style": 0,
      "@typescript-eslint/no-namespace": 0,
      "@typescript-eslint/no-explicit-any":0
    },
  },
);
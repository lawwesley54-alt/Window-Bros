/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web3Forms access key — see README.md "Quote form backend". */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

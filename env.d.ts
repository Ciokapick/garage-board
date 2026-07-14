/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HASH_ROUTING?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

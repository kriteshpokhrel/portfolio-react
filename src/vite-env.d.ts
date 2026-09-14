/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SHOW_RELIEF_BANNER?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
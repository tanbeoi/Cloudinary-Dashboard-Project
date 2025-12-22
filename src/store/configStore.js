import { create } from "zustand";
const DEFAULT_BASE_URL = import.meta.env.VITE_DEFAULT_BASE_URL || "";

const useConfigStore = create((set) => ({
  baseUrl: DEFAULT_BASE_URL,
  apiKey: "",
  setBaseUrl: (baseUrl) => set({ baseUrl }),
  setApiKey: (apiKey) => set({ apiKey }),
}));

export default useConfigStore;
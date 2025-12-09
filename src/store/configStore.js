import { create } from "zustand";

const useConfigStore = create((set) => ({
  baseUrl: "",
  apiKey: "",
  setBaseUrl: (url) => set({ baseUrl: url }),
  setApiKey: (key) => set({ apiKey: key }),
}));

export default useConfigStore;
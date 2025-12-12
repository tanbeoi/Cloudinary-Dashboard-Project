import { create } from "zustand";

/**
 * Session-only gallery of uploads.
 * Resets when the page is reloaded.
 */

//Zustand hook to keep track of any updates inside any component 
const useUploadsStore = create((set) => ({
  uploads: [],

  // Add newest uploads (item) to the *front* of the list
  addUpload: (item) =>
    set((state) => ({
      uploads: [item, ...state.uploads],
    })),

  // Clear everything (handy for debugging / future UI)
  clearUploads: () => set({ uploads: [] }),
}));

export default useUploadsStore;

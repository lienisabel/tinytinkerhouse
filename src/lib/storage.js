/* ---------------------------------------------------------------------
   localStorage-backed replacement for the Claude artifact's
   `window.storage` API. Same async get/set shape so the App code didn't
   have to change: get() resolves to { value } (or null when missing),
   set() resolves to true on success and throws if the browser refuses
   (private mode, quota exceeded, etc.).
--------------------------------------------------------------------- */

const PREFIX = "tinytinkerhouse:";

export const storage = {
  async get(key) {
    const value = window.localStorage.getItem(PREFIX + key);
    return value === null ? null : { key, value };
  },

  async set(key, value) {
    window.localStorage.setItem(PREFIX + key, value);
    return true;
  },
};

import useConfigStore from "../store/configStore";

export function getClient() {
    //get base URL and API key from the Zustand store (configStore)
  const { baseUrl, apiKey } = useConfigStore.getState();

  if (!baseUrl) {
    throw new Error("Base URL is not set in configStore.");
  }

  return {
    // Protected endpoint — needs API key
    async upload(formData: FormData) {
      const res = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        headers: {
          "x-api-key": apiKey || "",
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      return res.json();
    },

    // Protected endpoint — needs API key
    async getMetadata(key: string) {
      const res = await fetch(`${baseUrl}/metadata/${key}`, {
        headers: {
          "x-api-key": apiKey || "",
        },
      });

      if (!res.ok) {
        throw new Error(`Metadata fetch failed: ${res.status}`);
      }

      return res.json();
    },

    // Protected endpoint — needs API key
    async getSignedUrl(key: string) {
      const res = await fetch(`${baseUrl}/sign/${key}`, {
        headers: {
          "x-api-key": apiKey || "",
        },
      });

      if (!res.ok) {
        throw new Error(`Signed URL fetch failed: ${res.status}`);
      }

      return res.json();
    },

    // Public endpoint — no API key needed
    buildImageUrl(key: string, params?: Record<string, string | number>) {
      const url = new URL(`${baseUrl}/image/${key}`);

      if (params) {
        for (const [k, v] of Object.entries(params)) {
          url.searchParams.append(k, String(v));
        }
      }

      return url.toString();
    },
  };
}

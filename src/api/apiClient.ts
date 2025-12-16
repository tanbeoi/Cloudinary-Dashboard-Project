import useConfigStore from "../store/configStore";

export type ListItem = {
  key: string;
  size?: number;
  lastModified?: string;
};

export type ListResponse =
  | { items: ListItem[] }
  | { keys: string[] }
  | ListItem[]
  | string[];

type RequestOptions = {
  method?: string;
  auth?: boolean;
  headers?: HeadersInit;
  body?: BodyInit | null;
  query?: Record<string, string | number | boolean | null | undefined>;
};

export function getClient() {
    //get base URL and API key from the Zustand store (configStore)
  const { baseUrl, apiKey } = useConfigStore.getState();

  if (!baseUrl) {
    throw new Error("Base URL is not set in configStore.");
  }

  async function request<T = unknown>(
    path: string,
    // default to GET method and no auth
    { method = "GET", auth = false, headers, body, query }: RequestOptions = {}
  ): Promise<T> {
    const url = new URL(path, baseUrl);

    //Convert query parameters to URL search params
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, String(value));
      }
    }

    // Make the HTTP request using fetch API
    const res = await fetch(url.toString(), {
      method,
      headers: {
        // Add API key header if auth is true
        ...(auth ? { "x-api-key": apiKey || "" } : {}),
        ...(headers ?? {}),
      },
      body,
    });

    if (!res.ok) {
      let extra = "";
      try {
        // Tries to get error message from response body
        const text = await res.text();
        if (text) extra = ` - ${text}`;
      } catch {
        // ignore
      }
      throw new Error(`${method} ${url.pathname} failed: ${res.status}${extra}`);
    }

    // Parse response based on content type
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }

    // Fallback: many endpoints return JSON; if not, return text.
    return (await res.text()) as unknown as T;
  }

  return {
    // Protected endpoint — needs API key
    async upload(formData: FormData) {
      return request("/upload", { method: "POST", auth: true, body: formData });
    },

    // Protected endpoint — needs API key
    async getMetadata(key: string) {
      return request(`/metadata/${encodeURIComponent(key)}`, { auth: true });
    },

    // Protected endpoint — needs API key
    async getSignedUrl(key: string, expires: number = 3600) {
      return request(`/sign/${encodeURIComponent(key)}`, {
        auth: true,
        query: { expires },
      });
    },

    // Protected endpoint — needs API key
    async list(): Promise<ListResponse> {
      return request<ListResponse>("/list", { auth: true });
    },

    // Public endpoint — no API key needed
    buildImageUrl(key: string, params?: Record<string, string | number>) {
      const url = new URL(`/image/${encodeURIComponent(key)}`, baseUrl);

      if (params) {
        for (const [k, v] of Object.entries(params)) {
          url.searchParams.append(k, String(v));
        }
      }

      return url.toString();
    },

    
  };
}

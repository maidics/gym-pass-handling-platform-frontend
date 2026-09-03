import axios from "axios";
import { authUtils } from "../lib/authUtils.ts";
import i18n from "../i18n.ts";
import { ApiClient } from "./types.ts";
import { toast } from "sonner";

const t = i18n.t;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  transformResponse: [(data) => data],
});

let lastNetworkErrorTime = 0;
const NETWORK_ERROR_COOLDOWN = 5000;

const toastNetworkError = () => {
  const now = Date.now();

  if (now - lastNetworkErrorTime > NETWORK_ERROR_COOLDOWN) {
    lastNetworkErrorTime = now;
    toast.error(t("NetworkError"), {
      description: t("NetworkErrorDescription"),
      duration: 5000,
    });
  }
};

type ValidationProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function safeJsonParse(input: unknown) {
  if (typeof input !== "string") return input;
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
}

function isValidationProblemDetails(x: unknown): x is ValidationProblemDetails {
  return (
    isObject(x) &&
    isObject((x as any).errors) &&
    Object.values((x as any).errors).every(
      (v) => Array.isArray(v) && v.every((m) => typeof m === "string"),
    )
  );
}

function formatValidationErrors(
  errors: Record<string, string[]>,
  maxLines = 5,
) {
  const lines = Object.entries(errors).flatMap(([field, messages]) =>
    messages.map((m) => `${field}: ${m}`),
  );

  const sliced = lines.slice(0, maxLines);
  const remaining = lines.length - sliced.length;

  return remaining > 0
    ? `${sliced.join("\n")}\n…${remaining} more`
    : sliced.join("\n");
}

// HEADERS
axiosInstance.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      toastNetworkError();

      const error = new Error("OFFLINE");
      error.name = "OfflineError";

      return Promise.reject(error);
    }

    const token = authUtils.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Accept-Language"] = i18n.language;

    return config;
  },
  (error) => Promise.reject(error),
);

// ERROR HANDLING
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.name === "OfflineError") {
      return Promise.reject(error);
    }

    const status: number | null = error?.response?.status ?? null;

    // network / CORS / dropped connection
    if (!status || status === 0) {
      toastNetworkError();
      return Promise.reject(error);
    }

    const data = safeJsonParse(error?.response?.data);

    // Validation 400: should never show
    if (status === 400 && isValidationProblemDetails(data)) {
      const title =
        data.title ??
        t("ValidationError", { defaultValue: "Validation error" });
      const description = formatValidationErrors(data.errors ?? {});

      toast.error(title, { description });

      (error as any).validationErrors = data.errors;
      (error as any).problemDetails = data;

      return Promise.reject(error);
    }

    if (isObject(data)) {
      const message =
        (data as any).detail ||
        (data as any).title ||
        (data as any).message ||
        t("UnexpectedError");

      toast.error(message);
      (error as any).problemDetails = data;

      return Promise.reject(error);
    }

    toast.error(t("UnexpectedError"));
    return Promise.reject(error);
  },
);

const api = new ApiClient(undefined, axiosInstance);
export default api;

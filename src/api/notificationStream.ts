import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ClientNotification } from "@api/types";
import { authUtils } from "@lib/authUtils";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export function startUserEventsStream(opts: {
  language: string;
  onNotification: (n: ClientNotification) => void;
}) {
  const ac = new AbortController();
  const token = authUtils.getToken();

  const url = new URL("/api/ServerSentEvents", baseUrl).toString();

  fetchEventSource(url, {
    signal: ac.signal,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Accept-Language": opts.language,
      Accept: "text/event-stream",
    },
    onmessage: (ev) => {
      if (!ev.data) return;
      const raw = JSON.parse(ev.data);
      const notification = raw as ClientNotification;
      opts.onNotification(notification);
    },
  });

  return () => ac.abort();
}

// WebAuthn returns ArrayBuffers → backend expects base64url.

export function bufferToBase64url(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function base64urlToBuffer(base64url: string) {
  const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, "+").replace(/_/g, "/");

  const raw = atob(base64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

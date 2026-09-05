const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1

export function makeRef() {
  let body = "";
  const bytes = new Uint32Array(6);
  crypto.getRandomValues(bytes);
  for (const b of bytes) body += ALPHABET[b % ALPHABET.length];
  return `RC-${body.slice(0, 3)}-${body.slice(3)}`;
}

export function normalizeRef(input: string) {
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const body = cleaned.startsWith("RC") ? cleaned.slice(2) : cleaned;
  if (body.length !== 6) return input.trim().toUpperCase();
  return `RC-${body.slice(0, 3)}-${body.slice(3)}`;
}

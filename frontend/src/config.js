export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

if (import.meta.env.PROD && API_BASE_URL.includes("localhost")) {
  console.warn(
    "VITE_API_URL is pointing to localhost in production. Set it to your Render backend URL."
  );
}

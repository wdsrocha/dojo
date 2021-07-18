export const OPTIONS: RequestInit = {
  mode: "cors",
  credentials: "include",
  headers: new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  }),
};

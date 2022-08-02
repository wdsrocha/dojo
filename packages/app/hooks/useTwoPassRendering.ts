import { useState, useEffect } from "react";

/**
 * @returns true if client is hydrated
 * @see https://reactjs.org/docs/react-dom.html#hydrate
 * @see https://blog.hao.dev/render-client-side-only-component-in-next-js
 */
export const useTwoPassRendering = (): Boolean => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [setIsClient]);

  return isClient;
};

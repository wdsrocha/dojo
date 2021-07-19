// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
import { useRef, useEffect } from "react";

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<typeof callback>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current?.(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

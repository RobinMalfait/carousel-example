import { useEffect, useRef } from "react";

export function useWindowEvent(event, handler, options) {
  let savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    let cleanup = () => {};
    function handle(event) {
      cleanup = savedHandler.current.call(window, event);
    }
    window.addEventListener(event, handle, options);
    return () => {
      cleanup?.();
      window.removeEventListener(event, handle, options);
    };
  }, [event, savedHandler, options]);
}

import { useRef } from "react";
import { useWindowEvent } from "./use-window-event";

export function useSwipe(
  { left, right, up, down } = {},
  shouldSwipe = () => true
) {
  let initialX = useRef(null);
  let initialY = useRef(null);

  useWindowEvent("touchstart", (e) => {
    initialX.current = e.touches[0].clientX;
    initialY.current = e.touches[0].clientY;
  });

  useWindowEvent("touchmove", (e) => {
    if (!shouldSwipe()) return;
    if (initialX.current === null || initialY.current === null) {
      return;
    }

    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;

    let diffX = initialX.current - currentX;
    let diffY = initialY.current - currentY;

    let touches = Object.keys(e.touches).length;

    if (Math.abs(diffX) > Math.abs(currentY - initialY.current)) {
      if (diffX > 0) {
        left?.(touches);
      } else {
        right?.(touches);
      }
    } else {
      if (diffY > 0) {
        up?.(touches);
      } else {
        down?.(touches);
      }
    }

    initialX.current = null;
    initialY.current = null;

    e.preventDefault();
  });
}

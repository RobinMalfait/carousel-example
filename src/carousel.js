import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  createContext,
  useMemo,
  useId,
} from "react";
import { useSwipe } from "./use-swipe";

let CarouselContext = createContext();

export function Carousel({ children, wrap = true, ...props }) {
  let [slides, setSlides] = useState([]);
  let [activeSlideIdx, setActiveSlideIdx] = useState(0);

  let previous = useEvent((wrapAround = wrap) => {
    setActiveSlideIdx((current) => {
      return wrapAround
        ? (current + slides.length - 1) % slides.length
        : Math.max(current - 1, 0);
    });
  });

  let next = useEvent((wrapAround = wrap) => {
    setActiveSlideIdx((current) => {
      return wrapAround
        ? (current + slides.length + 1) % slides.length
        : Math.min(current + 1, slides.length - 1);
    });
  });

  let goto = useEvent((slide) => {
    let idx = slides.indexOf(slide);
    setActiveSlideIdx(constrain(idx, 0, slides.length - 1));
  });

  let register = useEvent((slide) => {
    setSlides((existing) => [...existing, slide]);

    return () => {
      setSlides((existing) => {
        let idx = existing.indexOf(slide);
        if (idx !== -1) {
          let copy = existing.slice();
          copy.splice(idx, 1);
          return copy;
        }
        return existing;
      });
    };
  });

  let bag = useMemo(
    () => ({ slides, activeSlideIdx, previous, next, goto, register }),
    [slides, activeSlideIdx, previous, next, goto, register]
  );

  useSwipe({
    left: () => next(false),
    right: () => previous(false),
  });

  return (
    <CarouselContext.Provider value={bag}>
      <div {...props}>{children({ slides, activeIndex: activeSlideIdx })}</div>
    </CarouselContext.Provider>
  );
}

Carousel.Slides = function Slides({ children, ...props }) {
  return <div {...props}>{children}</div>;
};

Carousel.Slide = function Slide({ children, ...props }) {
  let { register } = useContext(CarouselContext);
  let id = useId();

  useEffect(() => register(id), [register, id]);

  return <div {...props}>{children}</div>;
};

Carousel.PreviousButton = function PreviousButton({ children, ...props }) {
  let { previous } = useContext(CarouselContext);
  return (
    <button {...props} onClick={() => previous()}>
      {children}
    </button>
  );
};

Carousel.NextButton = function NextButton({ children, ...props }) {
  let { next } = useContext(CarouselContext);
  return (
    <button {...props} onClick={() => next()}>
      {children}
    </button>
  );
};

Carousel.Indicator = function Indicator({ children, slide, ...props }) {
  let { goto } = useContext(CarouselContext);

  return (
    <button {...props} onClick={() => goto(slide)}>
      {children}
    </button>
  );
};

function useEvent(cb) {
  let cache = useRef(cb);
  cache.current = cb;

  return useCallback((...args) => cache.current(...args), [cache]);
}

function constrain(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

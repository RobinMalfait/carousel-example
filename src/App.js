import { useState } from "react";
import { clsx } from "clsx";
import { Carousel } from "./carousel";

export default function App() {
  let [wrap, setWrap] = useState(true);

  let things = ["Hello 1", "Hello 2", "Hello 3", "Hello 4"];

  return (
    <div className="w-screen h-screen grid place-content-center p-5 bg-gray-50">
      <div className="bg-gray-100 rounded-md p-2 mb-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={wrap}
            onChange={(e) => setWrap(e.target.checked)}
          />
          <span>Wrap around</span>
        </label>
      </div>

      <Carousel
        wrap={wrap}
        className="relative flex flex-col bg-gray-100 flex overflow-hidden p-4 rounded-lg"
      >
        {({ slides, activeIndex }) => (
          <>
            <Carousel.Slides className="snap-x px-20 bg-gray-100 flex gap-4 overflow-hidden p-4 rounded-lg">
              {things.map((content, i) => (
                <Carousel.Slide key={i} className="snap-center">
                  <Card
                    active={activeIndex === i}
                    style={{
                      transform: `translateX(calc(-100% * ${activeIndex}))`
                    }}
                  >
                    {content}
                  </Card>
                </Carousel.Slide>
              ))}
            </Carousel.Slides>

            <Carousel.PreviousButton className="absolute left-4 top-1/2 -translate-y-1/2 shadow bg-white opacity-25 hover:opacity-100 rounded-full w-12 h-12 shrink-0">
              &larr;
            </Carousel.PreviousButton>

            {/* These could be <Tab> components if we make them composable */}
            <div className="px-4 flex items-center justify-center gap-2">
              {slides.map((slide, i) => (
                <Carousel.Indicator
                  key={i}
                  slide={slide}
                  className={clsx(
                    "rounded-full w-2 h-2",
                    i === activeIndex ? "bg-gray-800" : "bg-gray-300"
                  )}
                />
              ))}
            </div>

            <Carousel.NextButton className="absolute right-4 top-1/2 -translate-y-1/2 shadow bg-white opacity-25 hover:opacity-100 rounded-full w-12 h-12 shrink-0">
              &rarr;
            </Carousel.NextButton>
          </>
        )}
      </Carousel>
    </div>
  );
}

function Card({ children, active, ...props }) {
  return (
    <div
      className={clsx(
        "transition duration-300 bg-white rounded-md w-[75vw] h-[40vh] grid place-content-center text-6xl",
        !active && "opacity-50"
      )}
      {...props}
    >
      {children}
    </div>
  );
}

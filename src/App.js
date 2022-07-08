import { useState } from "react";
import { clsx } from "clsx";
import { Carousel } from "./carousel";

export default function App() {
  let [wrap, setWrap] = useState(true);

  let things = ["Hello 1", "Hello 2", "Hello 3", "Hello 4"];

  return (
    <div className="grid h-screen w-screen place-content-center bg-gray-50 p-5">
      <div className="mb-2 rounded-md bg-gray-100 p-2">
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
        className="relative flex flex flex-col overflow-hidden rounded-lg bg-gray-100 p-4"
      >
        {({ slides, activeIndex }) => (
          <>
            <Carousel.Slides className="flex snap-x gap-4 overflow-hidden rounded-lg bg-gray-100 p-4 px-20">
              {things.map((content, i) => (
                <Carousel.Slide key={i} className="snap-center">
                  <Card
                    active={activeIndex === i}
                    style={{
                      transform: `translateX(calc(-100% * ${activeIndex}))`,
                    }}
                  >
                    {content}
                  </Card>
                </Carousel.Slide>
              ))}
            </Carousel.Slides>

            <Carousel.PreviousButton className="absolute left-4 top-1/2 h-12 w-12 shrink-0 -translate-y-1/2 rounded-full bg-white opacity-25 shadow hover:opacity-100">
              &larr;
            </Carousel.PreviousButton>

            {/* These could be <Tab> components if we make them composable */}
            <div className="flex items-center justify-center gap-2 px-4">
              {slides.map((slide, i) => (
                <Carousel.Indicator
                  key={i}
                  slide={slide}
                  className={clsx(
                    "h-2 w-2 rounded-full",
                    i === activeIndex ? "bg-gray-800" : "bg-gray-300"
                  )}
                />
              ))}
            </div>

            <Carousel.NextButton className="absolute right-4 top-1/2 h-12 w-12 shrink-0 -translate-y-1/2 rounded-full bg-white opacity-25 shadow hover:opacity-100">
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
        "grid h-[40vh] w-[75vw] place-content-center rounded-md bg-white text-6xl transition duration-300",
        !active && "opacity-50"
      )}
      {...props}
    >
      {children}
    </div>
  );
}

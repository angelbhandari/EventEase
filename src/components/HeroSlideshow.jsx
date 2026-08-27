import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./HeroSlideshow.css";

// Curated set of premium event/decor photography — themes, catering
// tablescapes, entrance & stage decor, festive lighting. Add / remove
// entries here any time; the slider adapts automatically.
const slides = [
  {
    src: "https://i.pinimg.com/1200x/b1/10/36/b110367904116a82215bad271eddc438.jpg",
    alt: "Elegant floral entrance decor",
    position: "center",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1674759656360-936bebf85941?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Royal wedding stage decor",
    position: "center",
  },
  {
    src: "https://i.pinimg.com/736x/e2/9e/01/e29e011523c6640c99cf415e4a766356.jpg",
    alt: "Garden wedding catering & table setup",
    position: "top",
  },
  {
    src: "https://i.pinimg.com/736x/50/47/56/5047561086d23e36ca743963d9baf653.jpg",
    alt: "Luxury birthday theme decor",
    position: "center",
  },
  {
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=80",
    alt: "Festive lighting decor",
    position: "center",
  },
  {
    src: "https://images.unsplash.com/photo-1678514823267-437005e3ad50?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Red carpet prom entrance decor",
    position: "bottom",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1661322678247-a3cc08205511?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Modern elegant event decor",
    position: "center",
  },
  {
    src: "https://i.pinimg.com/1200x/12/66/74/126674f19ac1ca17355160e8af6de0d3.jpg",
    alt: "Festive celebration decor",
    position: "center",
  },
];

const SLIDE_DURATION = 5000; // ms between auto transitions

const HeroSlideshow = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-play — resets its timer whenever the user clicks a button,
  // so manual navigation doesn't fight with the automatic cycle.
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goToNext, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [activeIndex, goToNext]);

  if (slides.length === 0) return null;

  return (
    <div className="hero-slideshow" aria-hidden="true">
      {/* Sliding filmstrip: track shifts horizontally, each slide keeps
          its own slow Ken Burns zoom running independently */}
      <div
        className="hero-slide-track"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${activeIndex * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.src + index}
            className="hero-slide"
            style={{ width: `${100 / slides.length}%` }}
          >
            <div
              className={`hero-slide-bg ${index === activeIndex ? "is-zooming" : ""}`}
              style={{
                backgroundImage: `url('${slide.src}')`,
                backgroundPosition: slide.position || "center",
              }}
              role="img"
              aria-label={slide.alt}
            />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="hero-slide-nav hero-slide-nav-prev"
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className="hero-slide-nav hero-slide-nav-next"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>

          <div className="hero-slide-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.src + index}
                type="button"
                className={`hero-slide-dot ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlideshow;

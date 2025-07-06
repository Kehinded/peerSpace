// import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./FadeCarousel.css"; // optional custom styles

type Props = {
  images: string[];
  baseColor?: string; // optional gradient base color
};

function GradientFadeCarousel({ images, baseColor = "#1f1f1f" }: Props) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false,
  };

  const generateGradientBackground = (color: string, image: string): string => {
    return `linear-gradient(to bottom, ${color}cc 0%, ${color}88 50%, ${color}00 100%), url(${image})`;
  };

  return (
    <div className="gradient-carousel-wrapper">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div
            key={index}
            className="gradient-slide"
            style={{
              backgroundImage: generateGradientBackground(baseColor, img),
            }}
          />
        ))}
      </Slider>
    </div>
  );
}

export default GradientFadeCarousel;

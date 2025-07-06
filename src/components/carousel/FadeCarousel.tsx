// import React from "react";
import Slider from "react-slick";

import imgOne from "../../assets/images/Doctors-rafiki.png";
import imgTwo from "../../assets/images/Hospital patient-cuate.png";
import imgThree from "../../assets/images/Public health-bro.png";
import imgFour from "../../assets/images/Hospital building-bro.png";
import imgFive from "../../assets/images/Blood donation-amico.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useWindowSize from "../../helper/useWindowClick";

function FadeCarousel() {
  type imageListProps = {
    marginTop: string;
    img: any;
  };
  const size = useWindowSize();
  const imagesList: imageListProps[] = [
    { img: imgOne, marginTop: Number(size?.width) < 700 ? "0%" : "35%" },
    { img: imgFour, marginTop: Number(size?.width) < 700 ? "0%" : "25%" },
    { img: imgTwo, marginTop: Number(size?.width) < 700 ? "0%" : "45%" },
    { img: imgThree, marginTop: Number(size?.width) < 700 ? "0%" : "37%" },
    { img: imgFive, marginTop: Number(size?.width) < 700 ? "0%" : "20%" },
  ];

  const switchTime = 15000;

  const settings = {
    dots: false,
    infinite: true,
    speed: switchTime,
    fade: true,
    autoplay: true,
    autoplaySpeed: switchTime,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <div className="caurousel-wrap">
      <Slider {...settings}>
        {imagesList.map((src, index) => (
          <div key={index}>
            <img
              className="img"
              src={src?.img}
              alt={`Slide ${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: `translateY(${src?.marginTop})`,
              }}
            />
          </div>
        ))}
      </Slider>
      {/* <div className="gradient-overlay" /> */}
    </div>
  );
}

export default FadeCarousel;

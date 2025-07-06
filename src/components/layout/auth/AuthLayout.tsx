import React, { useEffect } from "react";
import "../../../styles/layout/auth/AuthLayout.css";
import {
  //   generateDeepDarkGradient,
  generateGradientWithImageBackground,
} from "../../../helper/helper";
import imgOne from "../../../assets/images/Doctors-rafiki.png";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../../routes/RouteList";
import FadeCarousel from "../../carousel/FadeCarousel";
// import FadeCarousel from "../carousel/FadeCarousel";

interface myComponentProps {
  children?: React.ReactNode;
}

const AuthLayout = ({ children }: myComponentProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("gelatomi");
    if (token) {
      navigate(ROUTE_PATH?.OVERVIEW);
    }
  }, []);

  return (
    <div className="auth-layout-wrap-index-reuse">
      {/* left box start */}
      <div className="left-box">
        <div
          style={{
            background: `${generateGradientWithImageBackground(
              "var(--primary-color)",
              imgOne
            )}`,
          }}
          className="inner-wrap-box"
        >
          <FadeCarousel />
        </div>
      </div>
      {/* left box end */}
      {/* right box start */}
      <div className="right-box">
        <div className="children-box">{children}</div>
      </div>
      {/* right box end */}
    </div>
  );
};

export default AuthLayout;

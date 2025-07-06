// import React from 'react'
import "../../styles/auth/LoginIndex.css";
import { RazorButton, RazorInputField } from "@kehinded/razor-ui";
import { useState } from "react";
import { scrollToTopVH, ValidateData } from "../../helper/helper";
// import { useNavigation } from "react-router-dom";
import { encrypt2 } from "../../utils/encrypt";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../routes/RouteList";
import AuthLayout from "../../components/layout/auth/AuthLayout";

const Loginindex = () => {
  const navigate = useNavigate();
  type detailProps = {
    first_name: string;
    last_name: string;
    designation: string;
    color?: string;
  };
  const [details, setDetails] = useState<detailProps>({
    first_name: "",
    last_name: "",
    designation: "",
    color: "",
  });
  const handleChange = (e?: any) => {
    const { value, name } = e?.target;
    const newObj = { ...details, [name]: value };
    setDetails(newObj);
  };

  const defaultObj = {
    first_name: "Kehinde-Paul",
    last_name: "Ayeni",
    designation: "Radiologist",
    work_place: "NHOG",
    followers: "456",
    peers: "678",
  };

  const handleRouteToDashboard = (e?: any) => {
    e && e.preventDefault();
    const encryptData = encrypt2(defaultObj);
    const toks = encrypt2("sghkshhxikshxsljxjs267873b7qhins");
    localStorage?.setItem("kractos", encryptData);
    localStorage?.setItem("gelatomi", toks);
    navigate(ROUTE_PATH?.OVERVIEW);
    scrollToTopVH();
  };

  const handleSubmit = () => {
    const obj = {
      first_name: details?.first_name,
      last_name: details?.last_name,
      designation: details?.designation,
      work_place: "NHOG",
      followers: "456",
      peers: "678",
    };
    const encryptData = encrypt2(obj);
    const toks = encrypt2("sghkshhxikshxsljxjs267873b7qhins");
    localStorage?.setItem("kractos", encryptData);
    localStorage?.setItem("gelatomi", toks);
    navigate(ROUTE_PATH?.OVERVIEW);
    scrollToTopVH();
  };

  return (
    <>
      <AuthLayout>
        <div className="login-index-wrap-auth">
          <div className="middle-wrap">
            {" "}
            {/* title text box start */}
            <div className="title-text-box">
              <p className="title">Welcome Champ!</p>
              <p className="text">Login to HCP network.</p>
            </div>
            {/* title text box end */}
            {/* form part start */}
            <form
              onSubmit={(e?: any) => {
                e.preventDefault();
                handleSubmit();
              }}
              autoComplete="off"
              action=""
              className="form-box"
            >
              <div className="two-box">
                {" "}
                <RazorInputField
                  label="First Name"
                  type="text"
                  placeholder="E.g Kehinde-Paul"
                  color="black-light"
                  name="first_name"
                  onChange={handleChange}
                  value={details?.first_name}
                />
                <RazorInputField
                  label="Last Name"
                  type="text"
                  placeholder="E.g Ayeni"
                  color="black-light"
                  name="last_name"
                  onChange={handleChange}
                  value={details?.last_name}
                />
              </div>

              <RazorInputField
                label="Designation"
                type="text"
                placeholder="E.g Doctor"
                color="black-light"
                name="designation"
                onChange={handleChange}
                value={details?.designation}
              />

              <RazorInputField
                // label="Designation"
                value={`Login`}
                type="submit"
                placeholder="E.g Doctor"
                color="black-light"
                className="submit"
                disabled={ValidateData({
                  paramOne: details,
                  ignoreKeys: ["color"],
                })}
                onChange={() => {
                  handleSubmit();
                }}
              />
            </form>
            {/* form part end */}
            {/* or box start  */}
            <div className="or-box">
              <span></span>
              <p className="or">or</p>
              <span></span>
            </div>
            {/* or box end */}
            <RazorButton
              label="Proceed without logging in"
              color="black-light"
              className="btn-login"
              onClick={handleRouteToDashboard}
            />
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default Loginindex;

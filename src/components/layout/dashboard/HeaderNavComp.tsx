import { useContext } from "react";
import "../../../styles/layout/dashboard/HeaderNavComp.css";
import ActionContext from "../../../context/ActionContext";
import {
  RazorButton,
  RazorTextTrim,
  RazorToggleSlide,
} from "@kehinded/razor-ui";
import { decrypt2 } from "../../../utils/encrypt";

const HeaderNavComp = () => {
  const actionCtx = useContext(ActionContext);
  const userDetails = localStorage?.getItem("kractos")
    ? decrypt2(localStorage?.getItem("kractos"))
    : null;
  const connectionList = [
    {
      text: "Show connection",
      value: actionCtx?.connections?.connection,
      key_name: "connection",
    },
    {
      text: "Show my connection on map",
      value: actionCtx?.connections?.connection_map,
      key_name: "connection_map",
    },
  ];

  return (
    <div className="header-nav-peer-index-wrap">
      {/* profile wrap start */}
      <div className="profile-wrap-box">
        {/* profile wrap start */}
        <div className="profile-wrap">
          <div className="avatar-box"></div>
          <div className="name-des-box">
            <p className="name">
              {RazorTextTrim(
                `${userDetails?.first_name} ${userDetails?.last_name}`,
                35
              ) || "Timi Ayeni"}
            </p>
            <p className="des">{`${
              userDetails?.designation || "Cardiologist"
            } at ${userDetails?.work_place || "NHOG"}`}</p>
          </div>
        </div>
        {/* profile wrap end */}
        {/* peer following create start */}
        <div className="peer-following-create-box">
          {/* peer follow box start */}
          <div className="peer-follow-box">
            <p className="label-value">
              My Peers<span>{userDetails?.peers || "234"}</span>
            </p>
            <p className="label-value">
              Following<span>{userDetails?.followers || "306"}</span>
            </p>
          </div>
          {/* peer follow box end */}
          <RazorButton color="black-light" label="Create Web" className="btn" />
        </div>
        {/* peer following create end */}
      </div>
      {/* profile wrap end */}
      {/* connect wrap start */}
      <div className="connection-wrap-box">
        {connectionList?.map((chi, idx) => {
          return (
            <div key={idx} className="toggle-text-box">
              <div className="toggle-peer">
                <RazorToggleSlide
                  key={`${idx}-${chi?.text}`}
                  id={`${idx}-${chi?.text}`}
                  onChange={() => {
                    actionCtx?.setConnections &&
                      actionCtx?.setConnections(chi?.key_name, !chi?.value);
                  }}
                  checked={chi?.value}
                  color={`black-light`}
                />
              </div>
              <p className="text">{chi?.text}</p>
            </div>
          );
        })}
      </div>
      {/* connect wrap end */}
    </div>
  );
};

export default HeaderNavComp;

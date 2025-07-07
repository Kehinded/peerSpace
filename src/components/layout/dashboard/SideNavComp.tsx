import { useContext } from "react";
import "../../../styles/layout/dashboard/SideNavComp.css";
import { ALL_ICONS } from "../../../assets/AllIcons";
import ActionContext from "../../../context/ActionContext";
import {
  RazorMenuFragment,
  RazorToggleSlide,
  RazorToolTip,
} from "@kehinded/razor-ui";
import { ROUTE_PATH } from "../../../routes/RouteList";
import { useLocation, useNavigate } from "react-router-dom";
import { colorToRgba } from "../../../helper/helper";
// import useWindowSize from "../../../helper/useWindowClick";

const SideNavComp = () => {
  const actionCtx = useContext(ActionContext);
  const navigate = useNavigate();
  const location = useLocation();
  const sidemenuList = [
    {
      name: "overview",
      icon: ALL_ICONS?.sidemenu_product,
      icon_two: ALL_ICONS?.sidemenu_product_active,
      link: ROUTE_PATH?.OVERVIEW,
    },
    {
      name: "profile",
      icon: ALL_ICONS?.sidemenu_profile,
      icon_two: ALL_ICONS?.sidemenu_profile_active,
      link: ROUTE_PATH?.PROFILE,
    },
    {
      name: "support",
      icon: ALL_ICONS?.sidemenu_message,
      icon_two: ALL_ICONS?.sidemenu_message_active,
      //   link: ROUTE_PATH?.OVERVIEW,
    },
    {
      name: "Bookings",
      icon: ALL_ICONS?.sidemenu_book,
      icon_two: ALL_ICONS?.sidemenu_book_active,
      //   link: ROUTE_PATH?.OVERVIEW,
    },
    {
      name: "Calendar",
      icon: ALL_ICONS?.sidemenu_calendar,
      icon_two: ALL_ICONS?.sidemenu_calendar_active,
      //   link: ROUTE_PATH?.OVERVIEW,
    },
    {
      name: "Location",
      icon: ALL_ICONS?.sidemenu_location,
      icon_two: ALL_ICONS?.sidemenu_location_active,
      //   link: ROUTE_PATH?.OVERVIEW,
    },
    {
      name: "Notification",
      icon: ALL_ICONS?.sidemenu_notification,
      icon_two: ALL_ICONS?.sidemenu_notification_active,
      //   link: ROUTE_PATH?.OVERVIEW,
    },
    {
      name: "Subscription",
      icon: ALL_ICONS?.sidemenu_payment,
      icon_two: ALL_ICONS?.sidemenu_payment_active,
      //   link: ROUTE_PATH?.OVERVIEW,
    },
    {
      name: "Reward",
      icon: ALL_ICONS?.sidemenu_reward,
      icon_two: ALL_ICONS?.sidemenu_reward_active,
      //   link: ROUTE_PATH?.OVERVIEW,
    },
    {
      name: "Settings",
      icon: ALL_ICONS?.sidemenu_settings,
      icon_two: ALL_ICONS?.sidemenu_settings_active,
      //   link: ROUTE_PATH?.OVERVIEW,
    },
  ];

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
    <div className="side-menu-nav-dashboard-index">
      <div
        className={`logo-collapse-box ${
          actionCtx?.sideNavCollapsed ? "logo-collapse-box-collapsed" : ""
        }`}
      >
        {/* app logo start */}
        <div className="app-logo-box">
          <figure className="img-box">{ALL_ICONS?.app_logo}</figure>
        </div>
        {/* app logo end */}
        {/* collapse icon start */}
        <div
          onClick={() => {
            actionCtx?.setSideNavCollapsed && actionCtx?.setSideNavCollapsed();
          }}
          className="collapse-icon-peer tooltip-hover-wrap"
        >
          <figure className="img-box">{ALL_ICONS?.collapse_icon}</figure>
          {actionCtx?.sideNavCollapsed && (
            <RazorToolTip
              text={
                actionCtx?.sideNavCollapsed
                  ? `Expand SideNav`
                  : "Collapse SideNav"
              }
              position={`right`}
              color="black-light"
            />
          )}
        </div>
        {/* collapse icon end */}
      </div>

      {/* sidemenu list box start */}
      <div className="sidemenu-box-list-wrap">
        {sidemenuList?.map((chi, idx) => {
          return (
            <RazorMenuFragment
              key={idx}
              icon={
                location?.pathname?.includes(chi?.link as string)
                  ? chi?.icon_two
                  : chi?.icon
              }
              collapse={actionCtx?.sideNavCollapsed}
              text={chi?.name}
              onClick={() => {
                if (chi?.link) {
                  navigate(chi?.link);
                  actionCtx?.setShowMobile && actionCtx?.setShowMobile();
                }
              }}
              active={location?.pathname?.includes(chi?.link as string)}
              type="two"
              activeDirection="right"
              activeBgColorTwo="var(--primary-color)"
              activeBgColor={colorToRgba("var(--primary-color)", 0.1)}
              textColor="#B5B5B5"
              activeTextColor="var(--primary-color)"
            />
          );
        })}
      </div>
      {/* sidemenu list box end */}
      {/* mobile switch connections start */}
      <div className="mobile-switch-connection-box">
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
                      actionCtx?.setSearch && actionCtx?.setSearch("");
                      actionCtx?.setShowMobile && actionCtx?.setShowMobile();
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
      {/* mobile switch connections end */}
      {/* logout box here */}
      <div className="logout-box">
        <RazorMenuFragment
          key={"dfghj"}
          icon={ALL_ICONS?.sidemenu_logout}
          collapse={actionCtx?.sideNavCollapsed}
          text={`Logout`}
          onClick={() => {
            actionCtx?.setLogoutModal && actionCtx?.setLogoutModal(true);
          }}
          activeDirection="right"
          activeBgColorTwo="transparent"
          activeBgColor={`transparent`}
          textColor="#B5B5B5"
          activeTextColor="var(--primary-color)"
        />
      </div>
      {/* logout box end */}
    </div>
  );
};

export default SideNavComp;

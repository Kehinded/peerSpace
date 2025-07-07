import { RazorLayout } from "@kehinded/razor-ui";
import React, { useContext } from "react";
import ActionContext from "../../../context/ActionContext";
import SideNavComp from "./SideNavComp";
import "../../../styles/layout/dashboard/DashboardLayout.css";
import HeaderNavComp from "./HeaderNavComp";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import ScrollToTop from "../../fragments/ScrollTop";

interface myComponentProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: myComponentProps) => {
  const actionCtx = useContext(ActionContext);


  return (
    <>
      <ScrollToTop />
      <RazorLayout
        collapse={actionCtx?.sideNavCollapsed}
        collapsible={true}
        // onClickCollapse={() => {
        //   actionCtx?.setSideNavCollapsed && actionCtx?.setSideNavCollapsed();
        // }}
        sideMenuBg="transparent"
        sideMenuComponent={<SideNavComp />}
        headerNavComponent={<HeaderNavComp />}
        collapseColor="var(--primary-color)"
        className="dashboard-peer-index-wrap"
        headerNavHeight={`max-content`}
        barColor="var(--primary-color)"
        setShowMobileMenu={() => {
          actionCtx?.setShowMobile && actionCtx?.setShowMobile();
        }}
        showMobileMenu={actionCtx?.ShowMobile}
      >
        {children}
      </RazorLayout>
      <ConfirmLogoutModal />
    </>
  );
};

export default DashboardLayout;

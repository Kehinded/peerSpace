import { RazorLayout } from "@kehinded/razor-ui";
import React, { useContext, useEffect } from "react";
import ActionContext from "../../../context/ActionContext";
import SideNavComp from "./SideNavComp";
import "../../../styles/layout/dashboard/DashboardLayout.css";
import HeaderNavComp from "./HeaderNavComp";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import ScrollToTop from "../../fragments/ScrollTop";
import { decrypt2 } from "../../../utils/encrypt";
import {
  computeFollowers,
  createAdjMap,
  defaultNames,
  generateSparseLinks,
  generateTempNodes,
} from "../../../utils/NodeData";

interface myComponentProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: myComponentProps) => {
  const actionCtx = useContext(ActionContext);

  useEffect(() => {
    const rawUser = localStorage.getItem("kractos");
    if (!rawUser) return;

    const userDetails = decrypt2(rawUser);
    const userName = `${userDetails.first_name} ${userDetails.last_name}`;
    const names = [...defaultNames, userName];

    const tempNodes = generateTempNodes(names); // you must move your logic into a reusable function
    const links = generateSparseLinks(tempNodes);
    const adjMap = createAdjMap(links);

    const nodesWithFollowers = tempNodes.map((node) => {
      const peers = adjMap[node.id]?.size ?? 0;
      const followers = computeFollowers(node.id, adjMap).size;
      return {
        ...node,
        noOfPeers: peers,
        noOfFollowers: peers + followers,
      };
    });

    if (actionCtx?.graphData?.nodes?.length < 1) {
      actionCtx?.setGraphData &&
        actionCtx?.setGraphData({ nodes: nodesWithFollowers, links });
    }
  }, []);

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

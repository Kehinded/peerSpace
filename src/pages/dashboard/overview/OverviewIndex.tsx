import React, { useContext, useEffect, useRef } from "react";
import DashboardLayout from "../../../components/layout/dashboard/DashboardLayout";
import "../../../styles/dashboard/overview/OverviewIndex.css";
import { RazorInputField } from "@kehinded/razor-ui";
import ProfileCardComp from "../../../components/fragments/ProfileCardComp";
import MetricsEducationComp from "../../../components/fragments/MetricsEducationComp";
import PeopleGraph, {
  type PeopleGraphHandle,
} from "../../../components/fragments/NodeMapComp";
import ActionContext from "../../../context/ActionContext";
import { scrollToTopVH } from "../../../helper/helper";
import { FaFilter, FaInfoCircle, FaSearch, FaSwift } from "react-icons/fa";
import { decrypt2 } from "../../../utils/encrypt";

const OverviewIndex = () => {
  // const [profile, se]
  const actionCtx = useContext(ActionContext);
  const graphRef = useRef<PeopleGraphHandle>(null);

  const iconList = [
    { name: "Filter", onClick: () => {}, icon: <FaFilter className="icon" /> },
    {
      name: "Search",
      onClick: () => {
        focusSearchInput();
      },
      icon: <FaSearch className="icon" />,
    },
    {
      name: "Info",
      onClick: () => {},
      icon: <FaInfoCircle className="icon" />,
    },
    {
      name: "Reset",
      onClick: () => {
        handleReset();
        scrollToTopVH();
      },
      icon: <FaSwift className="icon" />,
    },
  ];

  const handleSearch = (name: string) => {
    const data = graphRef.current?.focusOnNode(name);
    if (Number(data?.length) > 0) {
      actionCtx?.setSingleNodeinfo && actionCtx?.setSingleNodeinfo(data);
    } else {
      actionCtx?.setSingleNodeinfo && actionCtx?.setSingleNodeinfo([]);
    }
  };

  const handleReset = () => {
    graphRef.current?.resetGraphToDefault();
    scrollToTopVH();
  };

  const focusSearchInput = () => {
    scrollToTopVH();
    const input = document.getElementById(
      "search-input-peer"
    ) as HTMLInputElement | null;
    input?.focus();
  };

  const getUserName = () => {
    const userDetails = localStorage?.getItem("kractos")
      ? decrypt2(localStorage?.getItem("kractos"))
      : {};
    const name = `${userDetails?.first_name} ${userDetails?.last_name}`;
    return name;
  };

  useEffect(() => {
    if (actionCtx?.connections?.connection_map) {
      const userName = getUserName();
      const obj = actionCtx?.graphData?.nodes?.find(
        (ch) => ch?.name === userName
      );
      actionCtx?.setSingleNodeinfo && actionCtx?.setSingleNodeinfo([obj]);
    } else {
      actionCtx?.setSingleNodeinfo && actionCtx?.setSingleNodeinfo([]);
    }
  }, [actionCtx?.connections]);

  useEffect(() => {
    handleSearch(actionCtx?.search);
  }, [actionCtx?.search]);

  return (
    <>
      <DashboardLayout>
        <div className="overview-peer-index-wrap-box">
          {/* search filter box start */}
          <div className="search-flter-box-wrap">
            {/* search here start */}
            <RazorInputField
              color="black-light"
              type="search"
              id="search-input-peer"
              placeholder="Search by HCP name"
              className="search-input-peer"
              value={actionCtx?.search}
              onChange={(e?: any) => {
                actionCtx?.setSearch && actionCtx?.setSearch(e?.target.value);
              }}
              onBlur={() => {
                scrollToTopVH();
              }}
            />
            {/* search here end */}
            {/* filter box here  */}
            <div className="filter-box">
              <RazorInputField
                placeholder="Filter by:"
                color="black-light"
                type="select"
              />
            </div>
            {/* filter box end */}
          </div>
          {/* search filter box end */}
          {/* content down box start */}
          <div className="down-profile-content-box-wrap">
            {/* title start */}
            <p className="title">PeerSpace</p>
            {/* title end */}

            <div className="content-two-box-wrap">
              {/* profile content here */}

              <div
                className={`profile-content-box ${
                  Number(actionCtx?.singleNodeInfo?.length) > 0
                    ? "profile-content-box-show"
                    : ""
                }`}
              >
                {actionCtx?.singleNodeInfo?.map((chi, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      {/* profile-card-box start */}
                      <ProfileCardComp details={chi} />
                      {/* profile-card-box end */}
                      {/* education about box start */}
                      <MetricsEducationComp details={chi} />
                      {/* education about box end */}
                    </React.Fragment>
                  );
                })}
              </div>
              {/* profile content end */}
              {/* map container start */}
              <div className="map-container-wrapper">
                <PeopleGraph
                  onNodeClick={(param) => {
                    scrollToTopVH();
                    actionCtx?.setSingleNodeinfo &&
                      actionCtx?.setSingleNodeinfo([param]);
                    // if (actionCtx?.search) {
                    //   actionCtx?.setSearch && actionCtx?.setSearch("");
                    // }
                  }}
                  onNodeHover={(param) => {
                    // console.log(param);
                    actionCtx?.setSingleNodeinfo &&
                      actionCtx?.setSingleNodeinfo([param]);
                    if (actionCtx?.search) {
                      actionCtx?.setSearch && actionCtx?.setSearch("");
                    }
                  }}
                  ref={graphRef}
                  nodes={actionCtx?.graphData?.nodes}
                  links={actionCtx?.graphData?.links}
                  key={`fdfghk`}
                  muteConnections={!actionCtx?.connections?.connection}
                  showArrayConnections={actionCtx?.connections?.connection_map}
                  showOnlyForNames={[getUserName()]}
                />
                {/* icons-bow-wrapper start */}
                <div className="icons-wrapper-box">
                  {iconList?.map((chi, idx) => {
                    return (
                      <div
                        onClick={() => {
                          chi?.onClick && chi?.onClick();
                        }}
                        key={idx}
                        className="icon-box tooltip-hover-wrap"
                      >
                        {chi?.icon}
                        {/* <RazorToolTip
                          position={`left`}
                          color="black-light"
                          text={chi?.name}
                        /> */}
                      </div>
                    );
                  })}
                </div>
                {/* icons-bow-wrapper end */}
              </div>
              {/* map container end */}
            </div>
          </div>
          {/* content down box end */}
        </div>
      </DashboardLayout>
    </>
  );
};

export default OverviewIndex;

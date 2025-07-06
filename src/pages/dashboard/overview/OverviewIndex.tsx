import React, { useContext, useEffect, useRef, useState } from "react";
import DashboardLayout from "../../../components/layout/dashboard/DashboardLayout";
import "../../../styles/dashboard/overview/OverviewIndex.css";
import { RazorInputField } from "@kehinded/razor-ui";
import ProfileCardComp from "../../../components/fragments/ProfileCardComp";
import MetricsEducationComp from "../../../components/fragments/MetricsEducationComp";
import PeopleGraph, {
  type PeopleGraphHandle,
} from "../../../components/fragments/NodeMapComp";
import { links, nodes, userName } from "../../../utils/NodeData";
import ActionContext from "../../../context/ActionContext";
import { EmptyState } from "../../../components/fragments/EmptyState";
import { Users } from "lucide-react";

const OverviewIndex = () => {
  const actionCtx = useContext(ActionContext);
  const graphRef = useRef<PeopleGraphHandle>(null);
  const [search, setSearch] = useState("");
  const handleSearch = (name: string) => {
    const data = graphRef.current?.focusOnNode(name);
    if (Number(data?.length) > 0) {
      actionCtx?.setSingleNodeinfo && actionCtx?.setSingleNodeinfo(data);
    } else {
      actionCtx?.setSingleNodeinfo && actionCtx?.setSingleNodeinfo([]);
    }
  };

  useEffect(() => {
    handleSearch(search);
  }, [search]);

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
              placeholder="Search by HCP name"
              className="search-input-peer"
              value={search}
              onChange={(e?: any) => {
                setSearch(e?.target.value);
              }}
            />
            {/* search here end */}
            {/* filter box here  */}
            <div className="filter-box">
              <RazorInputField placeholder="Filter by:" color="black-light" type="select" />
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
                    // console.log(param);
                    actionCtx?.setSingleNodeinfo &&
                      actionCtx?.setSingleNodeinfo([param]);
                    if (search) {
                      setSearch("");
                    }
                  }}
                  onNodeHover={(param) => {
                    // console.log(param);
                    actionCtx?.setSingleNodeinfo &&
                      actionCtx?.setSingleNodeinfo([param]);
                    if (search) {
                      setSearch("");
                    }
                  }}
                  ref={graphRef}
                  nodes={nodes}
                  links={links}
                  key={`fdfghk`}
                  muteConnections={!actionCtx?.connections?.connection}
                  showArrayConnections={actionCtx?.connections?.connection_map}
                  showOnlyForNames={[userName]}
                />
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

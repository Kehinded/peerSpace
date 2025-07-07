import { createContext, useState } from "react";
import type { nodeProps } from "../@types/data";
import type { GraphLink, GraphNode } from "../components/fragments/NodeMapComp";

type connectionProps = {
  connection: boolean;
  connection_map: boolean;
};

interface ActionContextInterface {
  sideNavCollapsed?: boolean;
  setSideNavCollapsed?: (param?: string) => void;
  connections?: connectionProps;
  setConnections?: (key?: string, param?: boolean) => void;
  singleNodeInfo?: nodeProps[];
  setSingleNodeinfo?: (param?: any) => void;
  logoutModal: boolean;
  setLogoutModal: (param?: any) => void;
  ShowMobile: boolean;
  setShowMobile: (param?: any) => void;
  search: string;
  setSearch: (param: string) => void;
  graphData: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
  setGraphData: (param?: any) => void;
}

const ActionContext = createContext<ActionContextInterface>({
  setSideNavCollapsed: () => {},
  sideNavCollapsed: true,
  connections: {
    connection: false,
    connection_map: true,
  },
  setConnections: () => {},
  singleNodeInfo: [],
  setSingleNodeinfo: () => {},
  logoutModal: false,
  setLogoutModal: () => {},
  ShowMobile: false,
  setShowMobile: () => {},
  search: "",
  setSearch: () => {},
  graphData: {
    nodes: [],
    links: [],
  },
  setGraphData: () => {},
});

export function ActionContextProvider(props?: any) {
  const [sideNaveCollapse, setSideNavCollapsed] = useState<boolean>(true);
  const [connectionVal, setConnectionVal] = useState<connectionProps>({
    connection: true,
    connection_map: false,
  });

  const setConnectionfunc = (key?: any, param?: boolean) => {
    setConnectionVal((prev) => {
      return { ...prev, [key]: param };
    });
  };

  const setSideNavCollapsedFunc = (param?: string) => {
    if (param === "close") {
      setSideNavCollapsed(false);
    } else {
      setSideNavCollapsed(!sideNaveCollapse);
    }
  };

  const [singleNodeVal, setSingleNodeVal] = useState<nodeProps[]>([]);
  const setSingleNodeinfoFunc = (param?: any) => {
    setSingleNodeVal(param);
  };

  const [isLogoutVal, setIslogoutVal] = useState(false);
  function logoutModalChange(param: any) {
    setIslogoutVal(param);
  }

  const [MobileVal, setMobileVal] = useState(false);
  function SetMobivalFunc() {
    setMobileVal(!MobileVal);
  }

  const [search, setSearch] = useState("");
  const setSearchFunc = (param: string) => {
    setSearch(param);
  };

  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[];
    links: GraphLink[];
  }>({ nodes: [], links: [] });
  const setgraphDataFunc = (param: any) => {
    setGraphData(param);
  };

  const context = {
    setSideNavCollapsed: setSideNavCollapsedFunc,
    sideNavCollapsed: sideNaveCollapse,
    connections: connectionVal,
    setConnections: setConnectionfunc,
    singleNodeInfo: singleNodeVal,
    setSingleNodeinfo: setSingleNodeinfoFunc,
    logoutModal: isLogoutVal,
    setLogoutModal: logoutModalChange,
    ShowMobile: MobileVal,
    setShowMobile: SetMobivalFunc,
    search: search,
    setSearch: setSearchFunc,
    graphData: graphData,
    setGraphData: setgraphDataFunc,
  };

  return (
    <ActionContext.Provider value={context}>
      {props.children}
    </ActionContext.Provider>
  );
}

export default ActionContext;

import OverviewIndex from "../../pages/dashboard/overview/OverviewIndex";
import ProfileIndex from "../../pages/dashboard/profile/ProfileIndex";
import { ROUTE_PATH } from "../RouteList";

export const private_routes_group = [
  {
    path: ROUTE_PATH?.OVERVIEW,
    element: OverviewIndex,
  },
  {
    path: ROUTE_PATH?.PROFILE,
    element: ProfileIndex,
  },
];

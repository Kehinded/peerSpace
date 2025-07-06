import { decrypt2 } from "../../utils/encrypt";
import { ROUTE_PATH } from "../RouteList";

const PrivateRouteGaurd = ({ children }: any) => {
  const authenticated = localStorage.getItem("gelatomi");
  const userDetails = localStorage?.getItem("kractos") ? decrypt2(localStorage?.getItem("kractos")) : {};

  return authenticated && Object.keys(userDetails)?.length > 0
    ? children
    : window.location.replace(ROUTE_PATH?.LOGIN);
};

export default PrivateRouteGaurd;

import Loginindex from "../../pages/auth/Loginindex";
import { ROUTE_PATH } from "../RouteList";


export const auth_routes_group = [
    {
        path: ROUTE_PATH?.LOGIN,
        element: Loginindex,
    }
]
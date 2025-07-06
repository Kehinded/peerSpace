// import { useState } from "react";
import "./styles/App.css";
import { auth_routes_group } from "./routes/public";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PrivateRouteGaurd from "./routes/private/PrivateRouteGaurd";
import { private_routes_group } from "./routes/private";
import { ROUTE_PATH } from "./routes/RouteList";
import "@kehinded/razor-ui/dist/esm/styles/index.css";
// require("@kehinded/razor-ui/dist/esm/styles/index.css");

type RouteProp = {
  path: string;
  element: () => any;
  // location:
};

function App() {
  const location = useLocation();
  return (
    <>
      <div className="app">
        <Routes location={location}>
          <Route
            // location={location}
            path="/"
            element={<Navigate to={ROUTE_PATH?.LOGIN} />}
          />
          {/* auth group start */}
          {auth_routes_group?.map((route: RouteProp, idx: number) => (
            <Route key={idx} path={route.path} element={<route.element />} />
          ))}
          {/* auth group end */}
          {/* dashboard group start */}
          {private_routes_group?.map((route: RouteProp, idx: number) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <PrivateRouteGaurd>{<route.element />}</PrivateRouteGaurd>
              }
            />
          ))}
          {/* dashboard group end */}
        </Routes>
      </div>
    </>
  );
}

export default App;

// import { useState } from "react";
import "./styles/App.css";
import { auth_routes_group } from "./routes/public";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PrivateRouteGaurd from "./routes/private/PrivateRouteGaurd";
import { private_routes_group } from "./routes/private";
import { ROUTE_PATH } from "./routes/RouteList";
import "@kehinded/razor-ui/dist/esm/styles/index.css";
import { Helmet } from "react-helmet";
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
        <Helmet>
          <title>PeerSpace </title>
          {/* <title>The Raven Bank || The People’s Bank of Africa </title> */}
          <meta name="description" content="PeerSpace for" />
          <meta property="og:description" content="PeerSpace for" />
          <meta
            name="keywords"
            content="Access to world-class hospitals and clinics Seamless medical services across locations Flexible patient financing and health credit options Build your health savings account for future care Track treatment outcomes and care efficiency Boost patient engagement with personalized care Supporting healthcare across Nigeria and Africa Powering the future of healthtech innovation Experience rapid diagnostics and fast treatment delivery Manage corporate health plans with ease Tailored institutional patient portals for businesses Emergency-ready medical credit when you need it most Streamlined staff payroll for hospitals and clinics Smart medical inventory and billing automation Reliable prescription tracking and record management Instant medical referrals with a few clicks The most responsive hospital network in the region Advanced digital health tools and telemedicine access Secure chronic care funds and long-term health plans Easy medical bill payments and insurance top-ups Connect with remote monitoring through data bundles Pay for services like lab tests or consultations on-demand Issue digital health IDs and medical access cards Use health wallets for virtual or physical care Empower your care with high-speed medical connectivity"
          />
          <meta name="page-topic" content="Banking" />
          <meta name="page-type" content="Landing" />
          <meta name="audience" content="Everyone" />
          <meta
            property="og:image"
            content="https://res.cloudinary.com/dvgwgaqrk/image/upload/v1751823182/peerspace-favicon_fabk5m.png"
          />
          <meta property="og:url" content="https://peer-space.vercel.app" />
          <meta name="robots" content="index, follow" />
          <meta
            property="twitter:image:src"
            content="https://res.cloudinary.com/dvgwgaqrk/image/upload/v1751823182/peerspace-favicon_fabk5m.png"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image:alt" content="GetRavenBank" />
          <meta name="twitter:site" content="https://www.twitter.com" />
          <meta
            httpEquiv="Content-Security-Policy"
            content="default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
          />
        </Helmet>
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

import React, { useContext } from "react";
import { ALL_ICONS } from "../../assets/AllIcons";
import { RazorNumberFormat } from "@kehinded/razor-ui";
import ActionContext from "../../context/ActionContext";
import { formatDateToCustom } from "../../helper/helper";
import type { nodeProps } from "../../@types/data";

interface myComponentProps {
  details?: nodeProps;
}

const MetricsEducationComp = ({ details }: myComponentProps) => {
  const metricsList = [
    {
      title: "Patient Served",
      value: details?.patientsServed,
      percentage: "20",
      icon: ALL_ICONS?.metric_patient_served,
    },
    {
      title: "Success Rate",
      value: details?.successRate,
      percentage: "5",
      symbol: "%",
      icon: ALL_ICONS?.metric_sucess_rate,
    },
  ];
  return (
    <>
      <div className="education-about-box-wrap">
        {/* metrics card box list start */}
        <div className="metrics-card-wrap">
          {metricsList?.map((chi, idx) => {
            return (
              <div key={idx} className="metric-box">
                <div className="icon-text-box">
                  <div className="icon-box">
                    <figure className="img-box">{chi?.icon}</figure>
                  </div>
                  <p className="text">{chi?.title}</p>
                </div>
                <p className="value">{`${
                  RazorNumberFormat(chi?.value, {
                    hideDecimal: true,
                    hideSymbol: true,
                  }) || ""
                }${chi?.symbol ? chi?.symbol : ""}`}</p>
                <p className="percent">
                  {`${chi?.percentage || ""}${chi?.symbol ? chi?.symbol : ""}`}
                </p>
              </div>
            );
          })}
        </div>
        {/* metrics card box list end */}
        {/* about box start */}
        <div className="about-wrap-box">
          <p className="title">About</p>
          <p className="text">
            Emily Carter is a solid and Experienced and compassionate doctor
            specialising in cardiology
          </p>
        </div>
        {/* about box end */}
        {/* education wrap start */}
        <div className="education-wrap-box">
          {" "}
          <p className="title">Education</p>
          <div className="edu-info-box">
            <div className="left-box"></div>
            <div className="right-box">
              <p className="title-edu">
                {details?.university?.schoolName || ""}
              </p>
              <p className="degree">{details?.university?.degree || ""}</p>
              <p className="specialization">Specialization in Heart Health</p>
              <p className="date">{`${formatDateToCustom(
                details?.university?.startDate as string
              )} - ${formatDateToCustom(
                details?.university?.endDate as string
              )}`}</p>
            </div>
          </div>
        </div>
        {/* education wrap end */}
      </div>
    </>
  );
};

export default MetricsEducationComp;

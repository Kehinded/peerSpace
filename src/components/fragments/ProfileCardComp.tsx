import {
  RazorBadge,
  RazorButton,
  RazorNumberFormat,
  RazorTextTrim,
  RazorToolTip,
} from "@kehinded/razor-ui";
import type { nodeProps } from "../../@types/data";

interface myComponentProps {
  details?: nodeProps;
}

const ProfileCardComp = ({ details }: myComponentProps) => {
  const trimNo = 25;

  return (
    <>
      <div
        // onClick={() => {
        //   console.log(details);
        // }}
        className="profile-card-box"
      >
        <div className="map-avatar-box">
          <div className="map-box"></div>
          <div
            className="avatar-box"
            style={{ backgroundColor: details?.group }}
          >
            <div
              style={{ backgroundImage: `url(${details?.img})` }}
              className="inner-wrap"
            ></div>
          </div>
        </div>
        {/* map avatar end --- */}
        {/* content description box start */}
        <div className="content-description-box-wrap">
          <p className="name">{details?.name || ""}</p>
          {/* region designation start */}
          <div className="region-des-box">
            <RazorBadge
              text={RazorTextTrim(details?.designation, trimNo)}
              className="badge tooltip-hover-wrap"
            >
              {" "}
              {String(details?.designation)?.length >= trimNo ? (
                <RazorToolTip
                  text={details?.designation}
                  color="black-light"
                  position={`top-center`}
                />
              ) : (
                ""
              )}
            </RazorBadge>
            <RazorBadge
              text={RazorTextTrim(details?.address, trimNo)}
              className="badge tooltip-hover-wrap"
            >
              {String(details?.address)?.length > trimNo ? (
                <RazorToolTip
                  text={details?.address}
                  color="black-light"
                  position={`top-center`}
                />
              ) : (
                ""
              )}
            </RazorBadge>
          </div>
          {/* region designation end */}
          {/* about text start */}
          <p className="about-text">{details?.designationDescription || ""}</p>
          {/* about text end */}
          {/* peer follower start */}
          <div className="peer-follower-box-wrap">
            <div className="label-value-box">
              <p className="label">Peer</p>
              <p className="value">
                {RazorNumberFormat(details?.noOfPeers, {
                  hideDecimal: true,
                  hideSymbol: true,
                })}
              </p>
            </div>
            <div className="label-value-box">
              <p className="label">Followers</p>
              <p className="value">
                {" "}
                {RazorNumberFormat(details?.noOfFollowers, {
                  hideDecimal: true,
                  hideSymbol: true,
                })}
              </p>
            </div>
          </div>
          {/* peer follower end */}
          {/* btn and action box start */}
          <div className="btn-action-box-wrap">
            <RazorButton
              className="btn"
              color="black-light"
              label="View Profile"
            />
            <RazorButton
              className="btn btn-outline"
              color="black-light"
              label="Resume"
            />
            <div className="action-wrap"></div>
          </div>
          {/* btn and action box end */}
        </div>
        {/* content description box end */}
      </div>
    </>
  );
};

export default ProfileCardComp;

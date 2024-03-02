import { useContext, useEffect, useState } from "react";
import { BiSolidLock } from "react-icons/bi";
import { ToggleProfile } from "../context/ToggleProfile";
import Top from "../sub-components/Top";
import SearchComponent from "./SearchComponent";
import { GrGroup } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { GroupedUserType } from "../types/Types";
import { groupdata } from "../data/groupdata";

export default function Profile({ isGroup }: { isGroup?: boolean }) {
  const [profile, setProfile] = useState<GroupedUserType | {}>({});
  const allValues = useContext(ToggleProfile);
  if (!allValues) return null;
  const { showProfile, setShowProfile } = allValues;

  const { groupId } = useParams();
  useEffect(() => {
    const getUser = groupdata.find((user) => user.id === groupId);
    setProfile(getUser || {});
  }, [groupId]);

  return (
    <>
      <div
        style={{ width: "100%", height: "100vh" }}
        className={`${
          isGroup
            ? "rightbar-profile-container"
            : "no-home-rightbar-profile-container"
        }`}
      >
        <div
          className="contact-info-header pt-pl-6"
          style={{
            top: "0",
            position: "sticky",
            backgroundColor: "var(--dark-theme-bg)",
          }}
        >
          <div onClick={() => setShowProfile(!showProfile)}>
            <Top title="Profile Information" payload="" />
          </div>
        </div>
        <div>
          <img
            src="/bg.jpg"
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
            alt=""
          />
        </div>
        <div className="profile_details" style={{ marginTop: "-150px" }}>
          <div className="profile_image">
            <img
              src="https://cdn-icons-png.freepik.com/512/9073/9073174.png"
              alt=""
            />
          </div>
          <div className="profile_name_contacts">
            <p>{(profile as GroupedUserType).name}</p>
          </div>
        </div>
        <div className="profile_about">
          <p>About</p>
          <p style={{ width: "70%" }}>{(profile as GroupedUserType).bio}</p>
        </div>
        <div className="msg_credentials">
          <p>
            <BiSolidLock />
          </p>
          <div className="msg_credentails_message">
            <p>Group Admin</p>
            <p>{(profile as GroupedUserType).admin}</p>
          </div>
        </div>
        <div className="msg_credentials">
          <p>
            <BiSolidLock />
          </p>
          <div className="msg_credentails_message">
            <p>Credentials</p>
            <p>Messages are end-to-end encrypted.</p>
          </div>
        </div>
        <div className="msg_credentials">
          <p>
            <GrGroup />
          </p>
          <div className="msg_credentails_message">
            <p>All Members</p>
          </div>
        </div>
        <div className="all-members">
          <SearchComponent
            noSearch
            users={(profile as GroupedUserType).members}
          />
        </div>
      </div>
    </>
  );
}

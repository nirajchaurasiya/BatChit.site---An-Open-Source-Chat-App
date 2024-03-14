import "../styles/home.css";
import Linkscontainer from "./Linkscontainer";
import MessageCard from "./MessageCard";
import { BiSolidDislike, BiSolidLock } from "react-icons/bi";
import { GroupedMemberType, HomeParams } from "../types/Types";
import { useContext, useState } from "react";
import { ToggleProfile } from "../context/ToggleProfile";
import { ImCross } from "react-icons/im";
import { MdBlock, MdDelete, MdVerified } from "react-icons/md";
import SearchComponent from "./SearchComponent";
import { SearchUserContext } from "../context/searchedContext";
import UserProfile from "./UserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../types/Rootstate";
import { sendEmail } from "../utils/sendEmail";
import { AlertMessageType } from "../types/AlertTypes";
import { AlertMessages } from "../AlertMsg/alertMsg";
import { displayAlert } from "../utils/alertUtils";

export default function Home({
  children,
  home,
  groupMessages,
  history,
  profile,
  search,
  logout,
  message,
  isGroup,
  widthOfWindow,
  chatsCard,
}: HomeParams) {
  const [alertButtonText, setAlertButtonText] = useState(
    "Send activation link"
  );
  const [showAlert, setShowAlert] = useState(false);
  const [code, setCode] = useState(3001);
  const [msgType, setMsgType] = useState<AlertMessageType>("email");
  const [addGroupChat, setAddGroupChat] = useState(false);
  const showProfileOptions = useContext(ToggleProfile);

  const searchUserOptions = useContext(SearchUserContext);
  if (!searchUserOptions) return null;
  const { searchUser } = searchUserOptions;

  if (!showProfileOptions) {
    return null;
  }

  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );

  const navigate = useNavigate();

  const handleSendEmail = async () => {
    setAlertButtonText("Sending...");

    const response = await sendEmail("ACCOUNT_ACTIVATION");

    const { success, code } = response;
    if (success) {
      displayAlert(setShowAlert, setCode, setMsgType, code, "email", 5000);
      setAlertButtonText("Sent✅");
      setTimeout(() => {
        setAlertButtonText("Send activation link");
      }, 5000);
    } else {
      displayAlert(setShowAlert, setCode, setMsgType, 5001, "email", 5000);
      setAlertButtonText("Send activation link");
    }
  };
  const { userId } = useParams();

  const { showProfile, setShowProfile } = showProfileOptions;

  const { chatId } = useParams();

  const chats = useSelector((state: RootState) => state.chats.allChatCards);

  const handleAddGroupChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="home-container">
        <div className="home-mid-container">
          {/* All the links container or tab simply */}
          {widthOfWindow && widthOfWindow < 1050 ? (
            !userId && !chatId ? (
              <div
                className={`${
                  message ? "links-container" : "no-home-links-container"
                }`}
              >
                <Linkscontainer />
              </div>
            ) : (
              ""
            )
          ) : (
            <div
              className={`${
                message ? "links-container" : "no-home-links-container"
              }`}
            >
              <Linkscontainer />
            </div>
          )}

          {/* All the user who previously connected user */}
          {home && (
            <div
              className={`${
                message && showProfile
                  ? "all-users-container"
                  : "no-home-all-users-container"
              }`}
            >
              <div className="top-header pt-pl-6">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p>All Messages</p>
                  <p
                    style={{
                      paddingRight: "10px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => navigate("/search")}
                  >
                    +
                  </p>
                </div>
              </div>
              <div className="card-messages">
                {loggedInUser.isActivated ? (
                  chatsCard.filter((chat) => !chat.isGroupChat).length > 0 ? (
                    chatsCard
                      .filter((chat) => !chat.isGroupChat)
                      ?.map((card) => (
                        <MessageCard key={card._id} data={card} />
                      ))
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px 0 0 0",
                      }}
                    >
                      <p
                        style={{
                          background: "gray",
                          fontSize: "14px",
                          padding: "5px 10px",
                          borderRadius: "10px",
                        }}
                      >
                        Create a new chat
                      </p>
                    </div>
                  )
                ) : (
                  <>
                    <div className="activation-alert">
                      <div>
                        <p>
                          Please activate your account in order to start
                          messaging
                        </p>
                        <button onClick={handleSendEmail}>
                          {alertButtonText}
                        </button>
                      </div>
                    </div>
                    <div className="activation-alert">
                      <div>
                        <p>Tip #1: Do you know?</p>
                        <p style={{ marginTop: "-7px", color: "gray" }}>
                          Using this platform, you can send even large files
                          upto 2 GB.
                        </p>
                        <p style={{ color: "green" }}>Isn't it great?</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="encryption-msg">
                  <p>
                    <BiSolidLock />
                  </p>
                  <p>
                    Your personal messages are <span>end-to-end encrypted</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {message && (
            <div
              className={`${
                message && showProfile
                  ? " all-users-container "
                  : " no-home-all-users-container "
              } `}
            >
              <div className="top-header pt-pl-6">
                <p>All Messages</p>
              </div>
              <div className="card-messages">
                {loggedInUser.isActivated ? (
                  chatsCard.map((card) => (
                    <MessageCard key={card._id} data={card} />
                  ))
                ) : (
                  <>
                    <div className="activation-alert">
                      <div>
                        <p>
                          Please activate your account in order to start
                          messaging
                        </p>
                        <button onClick={handleSendEmail}>
                          {alertButtonText}
                        </button>
                      </div>
                    </div>
                    <div className="activation-alert">
                      <div>
                        <p>Tip #1: Do you know?</p>
                        <p style={{ marginTop: "-7px", color: "gray" }}>
                          Using this platform, you can send even large files
                          upto 2 GB.
                          <p style={{ color: "green" }}>Isn't it great?</p>
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <div className="encryption-msg">
                  <p>
                    <BiSolidLock />
                  </p>
                  <p>
                    Your personal messages are <span>end-to-end encrypted</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {groupMessages && (
            <div
              className={`${
                message && showProfile
                  ? "all-users-container"
                  : "no-home-all-users-container"
              }`}
            >
              <div className="top-header pt-pl-6">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p>Group Messages</p>
                  <p
                    style={{
                      paddingRight: "10px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => setAddGroupChat(!addGroupChat)}
                  >
                    +
                  </p>
                </div>
              </div>
              <div className="card-messages">
                {loggedInUser.isActivated ? (
                  chatsCard.filter((chat) => chat.isGroupChat).length > 0 ? (
                    chatsCard
                      .filter((chat) => chat.isGroupChat)
                      .map((card) => <MessageCard key={card._id} data={card} />)
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px 0 0 0",
                      }}
                    >
                      <p
                        style={{
                          background: "gray",
                          fontSize: "14px",
                          padding: "5px 10px",
                          borderRadius: "10px",
                        }}
                      >
                        No group found
                      </p>
                    </div>
                  )
                ) : (
                  <>
                    <div className="activation-alert">
                      <div>
                        <p>
                          Please activate your account in order to start
                          messaging
                        </p>
                        <button onClick={handleSendEmail}>
                          {alertButtonText}
                        </button>
                      </div>
                    </div>
                    <div className="activation-alert">
                      <div>
                        <p>Tip #1: Do you know?</p>
                        <p style={{ marginTop: "-7px", color: "gray" }}>
                          Using this platform, you can send even large files
                          upto 2 GB.
                          <p style={{ color: "green" }}>Isn't it great?</p>
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <div className="encryption-msg">
                  <p>
                    <BiSolidLock />
                  </p>
                  <p>
                    Your personal messages are <span>end-to-end encrypted</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {history && (
            <div
              className={`${
                message ? "all-users-container" : "no-home-all-users-container"
              }`}
            >
              <div className="top-header pt-pl-6">
                <p>History</p>
              </div>
            </div>
          )}
          {profile && (
            <div
              className={`${
                home ? "all-users-container" : "no-home-all-users-container"
              }`}
            >
              <div className="top-header pt-pl-6">
                <p>Profile</p>
              </div>

              <div className="card-messages">
                {loggedInUser.isActivated ? (
                  <UserProfile />
                ) : (
                  <>
                    <div className="activation-alert">
                      <div>
                        <p>
                          Please activate your account in order to start
                          messaging
                        </p>
                        <button onClick={handleSendEmail}>
                          {alertButtonText}
                        </button>
                      </div>
                    </div>
                    <div className="activation-alert">
                      <div>
                        <p>Tip #1: Do you know?</p>
                        <p style={{ marginTop: "-7px", color: "gray" }}>
                          Using this platform, you can send even large files
                          upto 2 GB.
                          <p style={{ color: "green" }}>Isn't it great?</p>
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <div className="encryption-msg">
                  <p>
                    <BiSolidLock />
                  </p>
                  <p>
                    Your personal messages are <span>end-to-end encrypted</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {search && (
            <div
              className={`${
                message ? "all-users-container" : "no-home-all-users-container"
              }`}
            >
              <div className="top-header pt-pl-6">
                <p>Search</p>
              </div>

              <div className="card-messages">
                {loggedInUser.isActivated ? (
                  <SearchComponent
                    users={searchUser as unknown as GroupedMemberType}
                  />
                ) : (
                  <>
                    <div className="activation-alert">
                      <div>
                        <p>
                          Please activate your account in order to start
                          messaging
                        </p>
                        <button onClick={handleSendEmail}>
                          {alertButtonText}
                        </button>
                      </div>
                    </div>
                    <div className="activation-alert">
                      <div>
                        <p>Tip #1: Do you know?</p>
                        <p style={{ marginTop: "-7px", color: "gray" }}>
                          Using this platform, you can send even large files
                          upto 2 GB.
                        </p>
                        <p style={{ color: "green" }}>Isn't it great?</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="encryption-msg">
                  <p>
                    <BiSolidLock />
                  </p>
                  <p>
                    Your personal messages are <span>end-to-end encrypted</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {logout && (
            <div
              className={`${
                message ? "all-users-container" : "no-home-all-users-container"
              }`}
            >
              <div className="top-header pt-pl-6">
                <p>Logout</p>
              </div>
            </div>
          )}

          {/* Show Message container */}
          <div
            style={isGroup ? { width: "60%" } : {}}
            className={`${
              isGroup || (message && showProfile)
                ? "show-message-container"
                : "no-home-show-message-container"
            } ${
              (userId || chatId) && widthOfWindow && widthOfWindow < 575
                ? " rightbar-message-fixed "
                : ""
            }`}
          >
            {loggedInUser.isActivated ? (
              children
            ) : (
              <div
                style={{
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="activation-alert">
                  <div>
                    <p>
                      In order to start messaging, you need to activate your
                      account
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* profile-container */}

          {message && showProfile && (
            <div
              className={`${
                message && showProfile
                  ? "rightbar-profile-container"
                  : "no-home-rightbar-profile-container"
              }`}
            >
              <div className="contact-info-header pt-pl-6">
                <p onClick={() => setShowProfile(!showProfile)}>
                  <ImCross />
                </p>
                <p>Contact Info</p>
              </div>
              <div className="profile_details">
                <div
                  className="profile_image"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <img src="/user1.jpg" alt="" />
                </div>
                <div className="profile_name_contacts">
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                    title="verified"
                  >
                    {chats?.find((field) => field._id === chatId)
                      ?.adminUserDetails?._id === loggedInUser?._id
                      ? chats?.find((field) => field._id === chatId)
                          ?.receiverUserDetails?.fullName
                      : chats?.find((field) => field._id === chatId)
                          ?.adminUserDetails?.fullName}
                    <MdVerified title="verified" />
                  </p>
                  <span>
                    {chats?.find((field) => field._id === chatId)
                      ?.adminUserDetails?._id === loggedInUser?._id
                      ? chats?.find((field) => field._id === chatId)
                          ?.receiverUserDetails?.email
                      : chats?.find((field) => field._id === chatId)
                          ?.adminUserDetails?.email}
                  </span>
                </div>
              </div>
              <div className="profile_about">
                <p>About</p>
                <p>
                  {chats?.find((field) => field._id === chatId)
                    ?.adminUserDetails?._id === loggedInUser?._id
                    ? chats?.find((field) => field._id === chatId)
                        ?.receiverUserDetails?.bio || "Hey, I am using @app!"
                    : chats?.find((field) => field._id === chatId)
                        ?.adminUserDetails?.bio || "Hey, I am using @app!"}
                </p>
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
              <div className="user_block_option">
                <p className="danger-zone">Danger Zone</p>
                <div className="delete_chat">
                  <p>
                    <MdBlock />
                  </p>
                  <span>
                    Block{" "}
                    {chats?.find((field) => field._id === chatId)
                      ?.adminUserDetails?._id === loggedInUser?._id
                      ? chats?.find((field) => field._id === chatId)
                          ?.receiverUserDetails?.fullName
                      : chats?.find((field) => field._id === chatId)
                          ?.adminUserDetails?.fullName}
                  </span>
                </div>
                <div className="delete_chat">
                  <p>
                    <BiSolidDislike />
                  </p>
                  <span>
                    Report{" "}
                    {chats?.find((field) => field._id === chatId)
                      ?.adminUserDetails?._id === loggedInUser?._id
                      ? chats?.find((field) => field._id === chatId)
                          ?.receiverUserDetails?.fullName
                      : chats?.find((field) => field._id === chatId)
                          ?.adminUserDetails?.fullName}
                  </span>
                </div>

                <div className="delete_chat">
                  <p>
                    <MdDelete />
                  </p>
                  <span>Delete chat</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {addGroupChat && (
          <div className="add-chat-container">
            <div className="add-chat-mid-container">
              <form
                onSubmit={handleAddGroupChat}
                className="form-control add-chat"
              >
                <p
                  style={{
                    fontSize: "20px",
                    textAlign: "center",
                    marginBottom: "20px",
                    fontWeight: "700",
                  }}
                >
                  Chat details
                </p>
                <div className="input">
                  <label htmlFor="group-name">Group Name</label>
                  <input
                    placeholder="Name of your group"
                    type="text"
                    id="group-name"
                  />
                </div>
                <div className="input">
                  <label htmlFor="add-group-user">Add Users</label>
                  <input
                    placeholder="Start typing to search a user"
                    type="text"
                    id="add-group-user"
                  />
                </div>
                <div className="add-btn-control">
                  <button type="submit">Add Chat</button>
                </div>
                <div className="add-btn-control cancel-btn">
                  <button
                    onClick={() => setAddGroupChat(!addGroupChat)}
                    type="reset"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showAlert && (
          <AlertMessages
            setShowAlert={setShowAlert}
            code={code}
            type={msgType}
          />
        )}
      </section>
    </>
  );
}

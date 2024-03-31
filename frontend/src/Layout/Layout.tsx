import { useEffect, useState } from "react";
import BlockedAccount from "../components/BlockedAccount";
import DeleteAccount from "../components/DeleteAccount";
import Home from "../components/Home";
import SelectaMessage from "../components/SelectaMessage";
import SingleMessage from "../components/SingleMessage";
import UserInformation from "../components/UserInformation";
import ViewSearchedPerson from "../components/ViewSearchedPerson";
import { LayoutParamsType } from "../types/Types";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../types/Rootstate";
import { getAllChatCards } from "../apis/chatActions";
import { displayAlert } from "../utils/alertUtils";
import { AlertMessages } from "../AlertMsg/alertMsg";
import { AlertMessageType } from "../types/AlertTypes";
import { appendChat, saveChatCards } from "../features/chat/chatSlice";
import GroupSingleMessage from "../components/GroupSingleMessage";
import { updatedSeenMessages } from "../features/messages/messageSlice";

export default function Layout({
  home,
  groupMessages,
  history,
  profile,
  search,
  logout,
  message,
  isGroup,
  blockedAccounts,
  userInformation,
  deleteAccount,
  socket,
}: LayoutParamsType) {
  const [widthOfWindow, setWidthOfWindow] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query");
  const [showAlert, setShowAlert] = useState(false);
  const [code, setCode] = useState(3001);
  const [msgType, setMsgType] = useState<AlertMessageType>("chatCards");

  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );
  const navigate = useNavigate();

  const chatsData = useSelector(
    (state: RootState) => state?.chats?.allChatCards
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.outerWidth;
      setWidthOfWindow(windowWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const updateIndividualChat = (data: any) => {
      const { specific_chat } = data;
      dispatch(appendChat(specific_chat));
    };
    socket?.on("update-chat-for-individual", updateIndividualChat);

    return () => {
      socket?.off("update-chat-for-individual", updateIndividualChat);
    };
  }, [socket]);

  useEffect(() => {
    const updateMessagesSeen = (data: any) => {
      dispatch(updatedSeenMessages(data));
    };

    socket?.on("update-seen-messages", updateMessagesSeen);

    return () => {
      socket?.off("update-seen-messages", updateMessagesSeen);
    };
  }, [socket]);

  useEffect(() => {
    const getChats = async () => {
      const chats = await getAllChatCards();
      if (chats.success) {
        const { code, data } = chats;
        displayAlert(
          setShowAlert,
          setCode,
          setMsgType,
          code,
          "chatCards",
          2000
        );
        dispatch(saveChatCards(data));
      }
    };
    getChats();
  }, []);

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/auth/login");
    }
  }, []);
  if (!loggedInUser) {
    return null;
  }
  return (
    <>
      <Home
        home={home}
        groupMessages={groupMessages}
        history={history}
        profile={profile}
        search={search}
        logout={logout}
        message={message}
        isGroup={isGroup}
        deleteAccount={deleteAccount}
        userInformation={userInformation}
        blockedAccounts={blockedAccounts}
        widthOfWindow={widthOfWindow}
        chatsCard={chatsData}
        socket={socket}
      >
        {home && <SelectaMessage widthOfWindow={widthOfWindow} />}
        {message && <SingleMessage socket={socket} />}
        {search && searchQuery && (
          <ViewSearchedPerson socket={socket} widthOfWindow={widthOfWindow} />
        )}
        {search && widthOfWindow > 575 && !searchQuery && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              marginTop: "30vh",
              fontSize: "17px",
              fontWeight: "700",
            }}
          >
            <p>Search an user to view</p>
          </div>
        )}
        {groupMessages && isGroup && <GroupSingleMessage socket={socket} />}
        {groupMessages && widthOfWindow > 575 && !isGroup && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              marginTop: "30vh",
              fontSize: "17px",
              fontWeight: "700",
            }}
          >
            <p>Select a group to view</p>
          </div>
        )}
        {profile &&
          widthOfWindow > 575 &&
          !userInformation &&
          !blockedAccounts &&
          !deleteAccount && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginTop: "30vh",
                fontSize: "17px",
                fontWeight: "700",
              }}
            >
              <p>Tab on left options to view</p>
            </div>
          )}
        {deleteAccount && <DeleteAccount />}
        {userInformation && <UserInformation widthOfWindow={widthOfWindow} />}
        {blockedAccounts && <BlockedAccount />}
      </Home>
      {showAlert && (
        <AlertMessages setShowAlert={setShowAlert} code={code} type={msgType} />
      )}
    </>
  );
}

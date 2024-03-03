import { useRef, useEffect, useContext, useState } from "react";
import "../styles/singlemessage.css";
import { IoCall, IoVideocam } from "react-icons/io5";
import { MdOutlineAttachFile } from "react-icons/md";
import MyMessagePart from "../sub-components/MyMessagePart";
import OtherPersonMessagePart from "../sub-components/OtherPersonMessagePart";
import { ToggleProfile } from "../context/ToggleProfile";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { getAllMessagesWithId } from "../apis/chatActions";
import Spinner from "./Spinner";
import { useDispatch, useSelector } from "react-redux";
import { saveMessages } from "../features/messages/messageSlice";
import { RootState } from "../types/Rootstate";
import { formatDateForInitialChatCreationAlert } from "../utils/messageDateFormat";
import { Chat, SingleChat } from "../types/Types";

export default function SingleMessage() {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const showProfileOptions = useContext(ToggleProfile);
  const [loading, setLoading] = useState(true);
  if (!showProfileOptions) {
    return null;
  }
  const { setShowProfile, showProfile } = showProfileOptions;
  useEffect(() => {
    // Scroll to the bottom of the message container when component mounts or updates
    if (messageContainerRef.current) {
      setTimeout(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
      }, 100);
    }
  }, []);

  const messages = useSelector(
    (state: RootState) => state.messages.allMessages
  );
  const chats = useSelector((state: RootState) => state.chats.allChatCards);
  const [recentChat, setRecentChat] = useState<Chat | {}>({});
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );

  useEffect(() => {
    const getAllMessages = async () => {
      setLoading(true);
      if (chatId) {
        const messages = await getAllMessagesWithId(chatId);
        const { success, data } = messages;
        if (success) dispatch(saveMessages(data));
      }
      setLoading(false);
    };
    getAllMessages();
  }, []);
  useEffect(() => {
    const openedChat = chats.find((chat) => chat._id === chatId);
    if (openedChat) setRecentChat(openedChat);
  }, []);
  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="single-message-container">
          <div className="single-message-container-header">
            <div className="back-sign">
              <BiArrowBack onClick={() => goBack()} />
              <div
                className="account-details"
                onClick={() => setShowProfile(!showProfile)}
              >
                <p>
                  {loggedInUser._id ===
                  (recentChat as SingleChat).adminUserDetails._id
                    ? (recentChat as SingleChat).chatName
                    : (recentChat as SingleChat).adminUserDetails.fullName}
                </p>
                <p>Active: 1 hr ago</p>
              </div>
            </div>
            <div className="call-icons">
              <IoCall />
              <IoVideocam />
            </div>
          </div>
          {/* All Messages */}
          <div className="user-msg-cntainer">
            <div className="alert_msg">
              <p>
                Created this chat on
                {formatDateForInitialChatCreationAlert(
                  (recentChat as SingleChat).createdAt
                )}
              </p>
            </div>
            <div ref={messageContainerRef}>
              {/* Message Container */}
              {loading ? (
                <Spinner />
              ) : (
                messages.map((message) => {
                  return (
                    <div key={message._id} className="users_conversation">
                      {loggedInUser._id === message.sender ? (
                        <MyMessagePart
                          data={message.content}
                          date={message.createdAt}
                        />
                      ) : (
                        <OtherPersonMessagePart
                          user={message.senderDetails}
                          data={message.content}
                          date={message.createdAt}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* Input Box */}
          <div className="input-box">
            <div className="file-icon">
              <label htmlFor="send-file">
                <MdOutlineAttachFile />
              </label>
              <input type="file" hidden id="send-file" />
            </div>
            <div className="send-message-form">
              <div className="message-input">
                <input type="text" placeholder="Enter message" />
              </div>
              <div className="send-btn">
                <button>
                  <IoMdSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

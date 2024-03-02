import { useRef, useEffect, useContext } from "react";
import "../styles/singlemessage.css";
import { IoCall, IoVideocam } from "react-icons/io5";
import { MdOutlineAttachFile } from "react-icons/md";
import MyMessagePart from "../sub-components/MyMessagePart";
import OtherPersonMessagePart from "../sub-components/OtherPersonMessagePart";
import { ToggleProfile } from "../context/ToggleProfile";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { IoMdSend } from "react-icons/io";

export default function SingleMessage() {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const showProfileOptions = useContext(ToggleProfile);
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
  });
  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="single-message-container">
      <div className="single-message-container-header">
        <div className="back-sign">
          <BiArrowBack onClick={() => goBack()} />
          <div
            className="account-details"
            onClick={() => setShowProfile(!showProfile)}
          >
            <p>Niraj Chaurasiya</p>
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
          <p>Created this chat on May 5, 2024</p>
        </div>
        <div ref={messageContainerRef}>
          {/* Message Container */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((e) => (
            <div key={e} className="users_conversation">
              <MyMessagePart />
              <OtherPersonMessagePart />
            </div>
          ))}
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
  );
}

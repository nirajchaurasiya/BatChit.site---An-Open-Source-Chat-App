import { useState, useEffect } from "react";
import { Messages } from "../types/Types";
import { messageDateFormat } from "../utils/messageDateFormat";
import { IoIosArrowDown, IoMdCheckmark } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";

export default function MyMessagePart({ message }: { message: Messages }) {
  const [media, setMedia] = useState<string | undefined>(undefined);
  const [showMenu, setShowMenu] = useState(false);
  const [scaleFactor, setScaleFactor] = useState<number>(1.0);
  const maxScale = 2.0;
  const minScale = 0.5;

  useEffect(() => {
    function handleScroll(event: WheelEvent) {
      const delta = event.deltaY;

      if (delta > 0) {
        // Zoom out
        if (scaleFactor > minScale) {
          setScaleFactor((prevScale) => prevScale - 0.1);
        }
      } else {
        // Zoom in
        if (scaleFactor < maxScale) {
          setScaleFactor((prevScale) => prevScale + 0.1);
        }
      }
    }

    // Attach event listener
    document.addEventListener("wheel", handleScroll, { passive: false });

    // Cleanup
    return () => {
      document.removeEventListener("wheel", handleScroll);
    };
  }, [scaleFactor]);
  return (
    <>
      <div className="user_conversation_container">
        <div className="my_msg_container">
          <div className="my_messages">
            {message?.media ? (
              <div className="media-message">
                <p className="message-value-with-media">{message?.content}</p>
                <div className="message-bottom-border"></div>
                {message?.media && (
                  <div
                    className="message-media"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {message?.mediaType?.split("/")?.includes("image") ? (
                      <div
                        onClick={() => {
                          setMedia(message?.media);
                        }}
                      >
                        <img src={message?.media} alt="media" />
                      </div>
                    ) : (
                      <video src={message?.media} controls />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div
                  className="chat-menu-dots"
                  onClick={() => {
                    setShowMenu(!showMenu);
                  }}
                >
                  <IoIosArrowDown />
                </div>
                {showMenu && (
                  <div className="chat-menu">
                    <p>Edit</p>
                    <p>Delete</p>
                  </div>
                )}
                <p className="message-value">{message?.content}</p>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <span>{messageDateFormat(message?.createdAt)}</span>
            {message?.isSeen ||
            message?.senderDetails?._id === message?.readBy ? (
              <span title="seen">
                <IoCheckmarkDone
                  style={{
                    marginLeft: "5px",
                    color: "lightgreen",
                    fontSize: "15px",
                  }}
                />
              </span>
            ) : (
              <span
                style={{ marginLeft: "5px", fontSize: "15px" }}
                title="sent"
              >
                <IoMdCheckmark />
              </span>
            )}
          </div>
        </div>
      </div>
      {media && (
        <div
          onClick={() => {
            setMedia(undefined);
          }}
          className="show-image-container"
        >
          <div className="show-image-side"></div>
          <div className="show-image-center">
            <img
              src={media}
              alt="image"
              style={{ transform: `scale(${scaleFactor})` }}
            />
          </div>
          <div className="show-image-side"></div>
        </div>
      )}
    </>
  );
}

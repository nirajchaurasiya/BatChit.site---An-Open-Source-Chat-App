import { useEffect, useState } from "react";
import { Messages } from "../types/Types";
import { messageDateFormat } from "../utils/messageDateFormat";

export default function OtherPersonMessagePart({
  message,
}: {
  message: Messages;
}) {
  const [media, setMedia] = useState<string | undefined>(undefined);
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
        <div className="user_msg_container">
          <div className="other_user_messages">
            {message?.media ? (
              <div
                className="media-message"
                style={{ background: "#262626", borderTopLeftRadius: "20px" }}
              >
                <p className="message-value-with-media">{message?.content}</p>
                <div className="message-bottom-border"></div>
                {message?.media && (
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setMedia(message?.media);
                    }}
                    className="message-media"
                  >
                    {message?.mediaType?.split("/")?.includes("image") ? (
                      <img
                        style={{
                          background: "#262626",
                          cursor: "pointer",
                        }}
                        src={message?.media}
                        alt="media"
                      />
                    ) : (
                      <video
                        style={{
                          background: "#262626",
                        }}
                        src={message?.media}
                        controls
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="message-value" style={{ maxWidth: "65%" }}>
                {message?.content}
              </p>
            )}
          </div>

          <span>{messageDateFormat(message?.createdAt)}</span>
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

import { useLocation } from "react-router-dom";
import "../styles/view-searced-person.css";
import { BiBlock } from "react-icons/bi";
import { useEffect, useState } from "react";
import { ViewSearchedPersonType } from "../types/Types";
import Top from "../sub-components/Top";
import { getSearchedUser } from "../apis/getSearchedUser";
import Spinner from "./Spinner";
import { addChat } from "../apis/chatActions";
import { saveChatCards } from "../features/chat/chatSlice";
import { AlertMessageType } from "../types/AlertTypes";
import { displayAlert } from "../utils/alertUtils";
import { AlertMessages } from "../AlertMsg/alertMsg";
import { getAlert } from "../utils/getAlertMsgWithType";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../types/Rootstate";

export default function ViewSearchedPerson({
  widthOfWindow,
  socket,
}: {
  widthOfWindow: number;
  socket: Socket | null;
}) {
  const [searchedObject, setSearchedObject] = useState<
    ViewSearchedPersonType | {}
  >({});
  const [showAlert, setShowAlert] = useState(false);
  const [code, setCode] = useState(3001);
  const [msgType, setMsgType] = useState<AlertMessageType>("chatCards");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query");
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      setSearchedObject({});

      if (searchQuery) {
        const getuser = await getSearchedUser(searchQuery);
        if (getuser) {
          setSearchedObject(getuser);
        }
      }
      setLoading(false);
    };
    setLoading(true);
    getUser();
  }, [searchQuery]);

  const handleAddChat = async () => {
    // const { fullName, _id } = searchedObject as ViewSearchedPersonType;
    // const response = await addChat(fullName, _id);
    // const { success, data, code, status } = response;
    // if (success) {
    //   dispatch(saveChatCards(data));
    //   displayAlert(setShowAlert, setCode, setMsgType, code, "chatCards", 2000);
    // } else if (status) {
    //   const alertMsgCode = getAlert(status, "chatCards");
    //   displayAlert(
    //     setShowAlert,
    //     setCode,
    //     setMsgType,
    //     alertMsgCode,
    //     "chatCards"
    //   );
    // }
    // making-individual-chat
    if (socket) {
      const data = {
        receiver: (searchedObject as ViewSearchedPersonType)._id,
        admin: loggedInUser?._id,
        chatName: (searchedObject as ViewSearchedPersonType).fullName,
      };

      socket.emit("making-individual-chat", data);
    }
  };

  return (
    <div className="view-searced-person">
      {!loading && (
        <>
          {searchQuery ? (
            (searchedObject as ViewSearchedPersonType).fullName ? (
              <div className="searched-profile">
                <div className="searched-profile-header">
                  {/* <p>{(searchedObject as ViewSearchedPersonType).name}</p> */}
                  <Top
                    widthOfWindow={widthOfWindow}
                    title={(searchedObject as ViewSearchedPersonType).fullName}
                  />
                  <button>
                    Block
                    <BiBlock />
                  </button>
                </div>
                <div className="searched-cover">
                  <img src="/bg.jpg" alt="" />
                </div>
                <div className="searched-profile_details">
                  <div className="searched-profile-details-pp">
                    <img src="/user1.jpg" alt="" />
                    <div className="profile_name">
                      <div>
                        <p>
                          {(searchedObject as ViewSearchedPersonType).fullName}
                        </p>
                        <span>Joined: July 12 2024</span>
                      </div>
                      <button onClick={handleAddChat}>Message</button>
                    </div>
                  </div>
                  <div className="profile_desc">
                    <p>About</p>
                    <span>
                      {(searchedObject as ViewSearchedPersonType).bio}
                    </span>
                  </div>
                  <div className="profile_desc">
                    <p>Email</p>
                    <span>
                      {(searchedObject as ViewSearchedPersonType).email}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="enter-query-to-search-alert">
                <p>No user found😢</p>
              </div>
            )
          ) : (
            widthOfWindow > 575 && (
              <div className="enter-query-to-search-alert">
                <p>Please enter a name to search</p>
              </div>
            )
          )}
        </>
      )}
      {loading && <Spinner />}
      {showAlert && (
        <AlertMessages setShowAlert={setShowAlert} code={code} type={msgType} />
      )}
    </div>
  );
}

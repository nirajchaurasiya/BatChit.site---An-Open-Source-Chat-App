import { messageDateFormat } from "../utils/messageDateFormat";

export default function OtherPersonMessagePart({
  data,
  date,
  user,
}: {
  data: string;
  date: Date;
  user: {
    _id: string;
    fullName: string;
    background: string;
    bio: string;
  };
}) {
  return (
    <div className="user_conversation_container">
      <div className="user_msg_container">
        <div className="other_user_messages">
          <p>{data}</p>
        </div>
        <span>{messageDateFormat(date)}</span>
      </div>
    </div>
  );
}

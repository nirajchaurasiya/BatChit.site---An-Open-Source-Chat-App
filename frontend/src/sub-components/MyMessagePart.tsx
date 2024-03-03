import { messageDateFormat } from "../utils/messageDateFormat";

// messageDateFormat
export default function MyMessagePart({
  data,
  date,
}: {
  data: string;
  date: Date;
}) {
  return (
    <div className="user_conversation_container">
      <div className="my_msg_container">
        <div className="my_messages">
          <p>{data}</p>
        </div>
        <span>{messageDateFormat(date)}</span>
      </div>
    </div>
  );
}

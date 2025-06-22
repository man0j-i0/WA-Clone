import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { MessageSquareText, PlusIcon, SendIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { useAuth } from "./AuthContext";

function ChatWindow() {
  const params = useParams();
  const [secondUser, setSecondUser] = useState();
  const [msg, setMsg] = useState("");
  const receiverId = params.chatid;
  const [msgList, setMsgList] = useState([]);
  const { userData } = useAuth();

  const chatId =
    userData?.id > receiverId
      ? `${userData.id}-${receiverId}`
      : `${receiverId}-${userData?.id}`;

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", receiverId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSecondUser(docSnap.data());
      }
    };

    const msgUnsubscribe = onSnapshot(doc(db, "user-chats", chatId), (docSnap) => {
      const messages = docSnap.data()?.messages || [];
      setMsgList(messages);

      if (messages.length) {
        const latestMsg = messages[messages.length - 1];

        if (latestMsg.sender === userData.id && latestMsg.sentAt) {
          const now = performance.now();
          const latency = now - latestMsg.sentAt;
          console.log(`Message delivery latency: ${latency.toFixed(2)} ms`);
        }
      }
    });

    getUser();

    return () => {
      msgUnsubscribe();
    };
  }, [receiverId]);

  const sendMsg = async () => {
    if (msg) {
      const date = new Date();
      const timeStamp = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      const sendTime = performance.now();

      const messagePayload = {
        text: msg,
        time: timeStamp,
        sender: userData.id,
        receiver: receiverId,
        sentAt: sendTime,
      };

      if (msgList?.length === 0) {
        await setDoc(doc(db, "user-chats", chatId), {
          chatId: chatId,
          messages: [messagePayload],
        });
      } else {
        await updateDoc(doc(db, "user-chats", chatId), {
          chatId: chatId,
          messages: arrayUnion(messagePayload),
        });
      }

      setMsg("");
    }
  };

  if (!receiverId)
    return (
      <section className="w-[70%] h-full flex flex-col gap-4 items-center justify-center">
        <MessageSquareText className="w-28 h-28 text-gray-400" strokeWidth={1.2} />
        <p className="text-sm text-center text-gray-400">
          Select any contact to
          <br />
          start a chat with.
        </p>
      </section>
    );

  return (
    <section className="w-[70%] h-full flex flex-col gap-4 items-center justify-center">
      <div className="h-full w-full bg-chat-bg flex flex-col">
        {/* Top bar */}
        <div className="bg-background py-2 px-4 flex items-center gap-2 shadow-sm">
          <img
            src={secondUser?.profile_pic || "/default-user.png"}
            alt="profile"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <h3>{secondUser?.name}</h3>
            {secondUser?.lastSeen && (
              <p className="text-xs text-neutral-400">
                last seen at {secondUser?.lastSeen}
              </p>
            )}
          </div>
        </div>

        {/* Chat body */}
        <div className="flex-grow flex flex-col gap-12 p-6 overflow-y-scroll">
          {msgList?.map((m, index) => (
            <div
              key={index}
              data-sender={m.sender === userData.id}
              className={`bg-white w-fit rounded-md p-2 shadow-sm max-w-[400px] break-words data-[sender=true]:ml-auto data-[sender=true]:bg-primary-light`}
            >
              <p>{m?.text}</p>
              <p className="text-xs text-neutral-500 text-end">{m?.time}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-background py-3 px-6 shadow flex items-center gap-6">
          <PlusIcon />
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMsg();
            }}
            className="w-full py-2 px-4 rounded focus:outline-none"
            placeholder="Type a message..."
          />
          <button onClick={sendMsg}>
            <SendIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChatWindow;

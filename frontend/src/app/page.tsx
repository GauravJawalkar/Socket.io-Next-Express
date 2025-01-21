"use client"
import { connectServer } from "@/utils/connectServer";
import { useEffect, useState } from "react";

export default function Home() {
  const [userName, setUserName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [joined, setJoined] = useState(false)
  const [messages, setMessages]: any = useState([])
  const [message, setMessage] = useState("")
  const [sender, setSender] = useState("")

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { roomId, userName }
    if (userName.trim() !== "" && roomId.trim() !== "") {
      connectServer.emit("join-room", data);
      setJoined(true);
    }
  }

  const handelSendMessage = (message: string) => {
    const data = { roomId, message, sender: userName }
    setMessages((prev: any) => [...prev, { sender: userName, message }])
    connectServer.emit("message", data);
    setMessage("")
  }

  useEffect(() => {
    connectServer.on('message', (data) => {
      setMessages((prev: any) => [...prev, data])
    });

    connectServer.on('user-joined', (message) => {
      setMessages((prev: any) => [...prev, { message }])
    })

    return () => {
      connectServer.off("user_joined");
      connectServer.off("message")
    }
  })

  return (
    <section className="flex items-center justify-center min-h-screen">

      {!joined ?
        <form onSubmit={handelSubmit} className="w-[500px] border px-10 py-16 rounded-md">
          <div className="flex items-center justify-center  flex-col gap-5">
            <h1 className="text-center font-bold text-5xl uppercase text-white">Join Room</h1>
            <input type="text" value={userName} onChange={(e) => { setUserName(e.target.value) }} placeholder="Enter UserName here" className="text-black text-md px-4 py-2 ring-1 ring-gray-400 w-full rounded" />
            <input type="text" value={roomId} onChange={(e) => { setRoomId(e.target.value) }} placeholder="Enter RoomId here" className="text-black text-md px-4 py-2 ring-1 ring-gray-400 w-full rounded" />
            <button type="submit" className="w-full bg-neutral-700 text-white px-4 py-2 rounded uppercase hover:bg-neutral-800 ease-linear duration-200">Join</button>
          </div>
        </form> : (
          <div>
            <div className="w-[500px] h-[500px] border bg-neutral-700 border-neutral-500 rounded-md px-4 py-4 overflow-y-auto">
              <div>{messages.map(({ message, sender }: any) => {
                return (<div className="bg-white w-fit px-4 py-1 rounded my-2" key={Math.random() * 10000 + 1}>
                  <h1 className="text-blue-500 text-base uppercase">{sender}</h1>
                  <p>{message}</p>
                </div>
                )
              })
              }
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handelSendMessage(message) }} className="my-2 gap-2 flex items-center justify-between">
              <input value={message} onChange={e => setMessage(e.target.value)} type="text" placeholder="Chat Here" className="w-full px-3 py-2 rounded" />
              <button type="submit" className="text-white px-3 py-2 bg-neutral-600 rounded">Send</button>
            </form>
          </div>
        )
      }

    </section >
  );
}

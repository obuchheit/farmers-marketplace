import { useEffect, useState } from "react"


const ChatsPage = () => {

  const [chats, setChats] = useState([]);

  useEffect(() => {
    
  }, [])

  return (
    <>
      {/* <h1>Chats</h1> */}
      <div>
        {chats.length > 0 ? (
          <h1>Your Chats</h1>
        ) : (
          <h1>No chats to display</h1>
        )}
      </div>
    </>
  )
}

export default ChatsPage
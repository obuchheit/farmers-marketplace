import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom";

const ChatsPage = () => {

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/v1/chat/chats/", {
        headers: {
          Authorization: `Token ${token}`,
        }
      });
      console.log(response.data)
      setChats(response.data.chats)
    } catch (error) {
      console.error("Error fetching chats:", error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchChats()
  }, [])

  return (
    <>
      {/* <h1>Chats</h1> */}
      <div>
        {loading ? (
          <h2>Loading chats...</h2>
        ) : (
          <div>
            {chats.length > 0 ? (
              <div>
                <h1>Your Chats</h1>
                <ul>
                  {chats.map((chat) => (
                    <li key={chat.conversation_id} >
                      <Link to={`/chats/${chat.conversation_id}`}>
                        Chat with {chat.other_users[0].full_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <h1>No chats to display</h1>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ChatsPage;
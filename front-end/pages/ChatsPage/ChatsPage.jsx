import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom";
import './ChatPage.css'

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
      <div>
        {loading ? (
          <div>
            <h2>Loading chats...</h2>
          </div>
        ) : (
          <div>
            {chats.length > 0 ? (
              <div>
                <div className="top-content">
                  <h1>Your Chats</h1>
                </div>
                <div className="chat-list-display">
                  <ul>
                    {chats.map((chat) => (
                      <div key={chat.conversation_id} className="chat-item-content">
                        <Link to={`/chats/${chat.conversation_id}`} className="chat-link">
                        <h3>{chat.other_users[0].full_name}</h3>
                        </Link>
                      </div>
                    ))}
                  </ul>
                </div>
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
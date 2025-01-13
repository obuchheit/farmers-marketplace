import ChatFormComponent from "../../components/ChatFormComponent";
import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import './NewMessagePage.css'

const NewMessagePage = () => {
   
  const user = useOutletContext();
  const { userFullName, otherUserId } = useParams();
  const [messageInput, setMessageInput] = useState('');
  const navigate = useNavigate();
  // console.log(user)

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createConversation = async () => {
      const token = localStorage.getItem('token')
      const response = await axios.post("http://localhost:8000/api/v1/chat/start-chat/", {
        user_ids: [parseInt(otherUserId), user.user.id],
        message: messageInput
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      if (response.data.conversation_id) {
        navigate(`/chats/${response.data.conversation_id}`)
      } else {
        console.error("Failed to create chat:", response.data)
      }
    }
    
    createConversation();
  }



  return (
    <div className="new-message-page">
      <h1>New Message Request for {userFullName}</h1>
      <ChatFormComponent 
        messageInput={messageInput}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}  
      />
    </div>
  )
}

export default NewMessagePage;
import ChatFormComponent from "../../components/ChatFormComponent";
import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

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
      const response1 = await axios.get("http://localhost:8000/api/v1/users/profile", {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      console.log(response1.data)
      if (response1.data.id) {

        const response2 = await axios.post("http://localhost:8000/api/v1/chat/start-chat/", {
          user_ids: [parseInt(otherUserId), response1.data.id],
          message: messageInput
        }, {
          headers: {
            'Authorization': `Token ${token}`
          }
        })
        if (response2.data.conversation_id) {
          navigate(`/chats/${response2.data.conversation_id}`)
        } else {
          console.error("Failed to create chat:", response2.data)
        }
      }
    }
    
    createConversation();
  }



  return (
    <>
      <h1>New Message Request for {userFullName}</h1>
      <ChatFormComponent 
        messageInput={messageInput}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}  
      />
    </>
  )
}

export default NewMessagePage;
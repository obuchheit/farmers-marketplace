import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatFormComponent from '../../components/ChatInputForm/ChatFormComponent';
import axios from 'axios';
import './SingleConvoPage.css'

const SingleConvoPage = () => {

  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [ws, setWs] = useState(null);
  const [users, setUsers] = useState([])
  const [userData, setUserData] = useState(null);
  const [otherUserData, setOtherUserData] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/chat/${conversationId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setMessages(response.data.messages)
      setConversation(response.data.conversation)
      setUsers(response.data.conversation.users)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (messageInput.trim()) { 
      const token = localStorage.getItem('token'); 
      const userId = userData.id;

      const messageData = { 
        message: messageInput,
        senderId: userId,
      };

      ws.send(JSON.stringify(messageData))

      setMessageInput('')

      const response = await axios.post(`http://localhost:8000/api/v1/chat/${conversationId}/`, messageData, {
        headers: {
          Authorization: `Token ${token}`,
        }
      })
    }
  };
  
  useEffect(() => {    
    fetchMessages()
    
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}/`);      
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('Recieved message:', data)
      setMessages((prevMessages) => [
          ...prevMessages, 
          { sender: data.senderId, 
            content: data.message,
          },
      ]);
    };
    setWs(socket)

    return () => {
      socket.close();
    }
  }, [])

  useEffect(() => {  
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');        
        const response1 = await axios.get("http://localhost:8000/api/v1/users/profile", {
          headers: { 'Authorization': `Token ${token}` }
        });

        const user_id  = response1.data.id;
        const selectOtherUserId = (users, user_id) => users.find(id => id !== user_id);
        const otherUser_id = selectOtherUserId(users, user_id)

        const response2 = await axios.get(`http://localhost:8000/api/v1/users/user/${user_id}`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        setUserData(response2.data);        
        setOtherUserId(otherUser_id)

        const response3 = await axios.get(`http://localhost:8000/api/v1/users/user/${otherUser_id}`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        setOtherUserData(response3.data)

      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData();
  }, [messages, users])

  return (
    <div className='whole-page'>
      <div className='chat-header'>
        <h1>Conversation with {otherUserData ? (`${otherUserData.first_name} ${otherUserData.last_name}`) : 'Loading...'}</h1>
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === userData?.id ? 'user-message' : 'other-message'}`}>
              <strong>
                {msg.sender === userData?.id ? userData.first_name : (msg.sender === otherUserData?.id ? otherUserData.first_name : 'Unknown')}:
              </strong> 
              {msg.content}
            </div>
          ))}
        </div>
        <ChatFormComponent 
          messageInput={messageInput} 
          handleInputChange={handleInputChange} 
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default SingleConvoPage;

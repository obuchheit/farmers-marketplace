import { Form  } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ChatFormComponent from '../../components/ChatFormComponent';
import axios from 'axios';
import './SingleConvoPage.css';


const SingleConvoPage = () => {

  const { conversationId } = useParams();
  const user = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [ws, setWs] = useState(null);
      
  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/chat/${conversationId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setMessages(response.data.messages)
      console.log(response.data)
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
      const messageData = { 
        message: messageInput,
        token: token      // Alternatively, pass the token if necessary for security purposes
      };

      ws.send(JSON.stringify(messageData))
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", content: messageInput }
      ]);
      setMessageInput('')
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
      setMessages((prevMessages) => [
          ...prevMessages, 
          { sender: 'other', text: data.message },
      ]);
    };

    setWs(socket)

    return () => {
      socket.close();
    }
  }, [])

  return (
    <div className='single-convo-page'>
      <h1>Conversation</h1>
      <div>
        {/* Display for messages*/}
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-message" : "other-message"}>
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
  )
}

export default SingleConvoPage;

// if (isFirstMessage) {
//   console.log(user)


//   setIsFirstMessage(false)

// } else {
  
//   const token = localStorage.getItem('token'); // You might also have user info in the state or context
//   const messageData = { 
//     message: messageInput,
//     username: user.user,  // Pass the user ID or another identifying piece of data
//     token: token      // Alternatively, pass the token if necessary for security purposes
//   }

//   ws.send(JSON.stringify(messageData));
//   setMessages((prevMessages) => [
//     ...prevMessages,
//     { sender: "user", text: messageInput }
//   ]);
//   setMessageInput('')
// }

// return () => {
//   if (socket) {
//     socket.close();
//   };
// };

// useEffect(() => {
//   if (conversationId && ws) {
//     const messageData = { message: messageInput };
   
//     ws.send(JSON.stringify(messageData));

//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { sender: "user", text: messageInput }
//     ]);

//     setMessageInput('');
//   }
// }, [isFirstMessageSent])
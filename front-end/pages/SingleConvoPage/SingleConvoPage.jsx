import { Form  } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ChatFormComponent from './ChatFormComponent';

const SingleConvoPage = () => {

  const { otherUserId } = useParams();
  const user = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [ws, setWs] = useState(null);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  
  console.log("beginning of component cycle")
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const createConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:8000/api/v1/chat/start-chat/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          user_ids: [otherUserId], // Other user involved in the conversation
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        // Conversation was created successfully
        setConversationId(data.conversation_id); // Store conversation ID
        // setIsFirstMessageSent(true); // Now we can send the first message
        console.log("convo id set")
      } else {
        console.error('Failed to create conversation:', data.error);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (messageInput.trim()) { 
      if (isFirstMessage) {
        const token = localStorage.getItem('token'); // You might also have user info in the state or context
        console.log(user)

        const messageData = { 
          message: messageInput,
          username: user.user,  // Pass the user ID or another identifying piece of data
          token: token      // Alternatively, pass the token if necessary for security purposes
        }

        ws.send(JSON.stringify(messageData))
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "user", text: messageInput }
        ]);
        setMessageInput('')
        setIsFirstMessage(false)

      } else {
        
        const token = localStorage.getItem('token'); // You might also have user info in the state or context
        const messageData = { 
          message: messageInput,
          username: user.user,  // Pass the user ID or another identifying piece of data
          token: token      // Alternatively, pass the token if necessary for security purposes
        }

        ws.send(JSON.stringify(messageData));
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "user", text: messageInput }
        ]);
        setMessageInput('')
      }

      console.log("whatever")
      console.log(conversationId)
    }
  };
  
  useEffect(() => {
    if (conversationId && !ws) {
      console.log("Conversation ID:", conversationId)
      const socket = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}/`);  
      
      socket.onopen = () => {
        console.log("Connected to WebSocket server");
      };
      
      socket.onmessage = (e) => {
        // const data = JSON.parse(e.data);
        // setMessages((prevMessages) => [
        //   ...prevMessages, 
        //   { sender: 'other', text: data.message },
        // ]);
      };
      
      setWs(socket)
  
      // socket.onclose = () => {
      //   console.log("Disconnected from WebSocket server");
      // };
    }
  }, [conversationId])

  useEffect(() => {   
    createConversation();
    console.log("convo created")
  }, []);
  
  return (
    <>
      <h1>Conversation</h1>
      <div>
        {/* Display for messages*/}
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-message" : "other-message"}>
            {msg.text}
          </div>
        ))}
      </div>
      <ChatFormComponent 
        messageInput={messageInput} 
        handleInputChange={handleInputChange} 
        handleSubmit={handleSubmit}
      />
    </>
  )
}

export default SingleConvoPage;


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
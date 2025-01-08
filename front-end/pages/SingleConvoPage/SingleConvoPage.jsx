import { Form  } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SingleConvoPage = () => {

  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [ws, setWs] = useState(null);
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);

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
        setIsFirstMessageSent(true); // Now we can send the first message
      
        if (conversationId) {
          const messageData = { message: messageInput };
          ws.send(JSON.stringify(messageData));
  
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "user", text: messageInput }
          ]);
  
          setMessageInput('');
        }
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
      if (!isFirstMessageSent) {
        await createConversation();
      }

      // Send message to WebSocket if a conversation exists
      if (conversationId) {
        const messageData = { message: messageInput };
        ws.send(JSON.stringify(messageData));

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "user", text: messageInput }
        ]);

        setMessageInput('');
      }
    }
  };
  
  useEffect(() => {
    if (conversationId) {
      console.log("Conversation ID:", conversationId)
      const socket = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}/`);

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setMessages((prevMessages) = [...prevMessages, { sender: 'other', text: data.message }]);
      };
      
      socket.onopen = () => {
        console.log("Connected to WebSocket server");
      };
      
      socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };

      setWs(socket)
      
      return () => {
        if (socket) {
          socket.close();
        };
      };
    }
  }, [conversationId]);
  
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
      <Form onSubmit={handleSubmit}>
        <textarea 
          value={messageInput}
          onChange={handleInputChange}
          rows="4"
          cols="50"
          placeholder='Type a message...'
          />       
        <Button type='submit' disabled={!messageInput.trim()}>
          Send
        </Button>
      </Form>
    </>
  )
}

export default SingleConvoPage



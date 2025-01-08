import { Form  } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import { useState } from 'react';

const SingleConvoPage = () => {

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('')

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (messageInput.trim()) {  // Check if the message input is not empty or just whitespace
      // Add the new message to the conversation (sent by the current user)
      const newMessage = { sender: 'user', text: messageInput };
      setMessages([...messages, newMessage]);  // Update the messages state with the new message
  
      // Clear the input field after sending
      setMessageInput('');
    }

  }

  return (
    <>
      <h1>Conversation</h1>
      <div>
        {/* Display for messages*/}
        {messages.map((msg, index) => (
          <div
            key={index}
            className=''
          >
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
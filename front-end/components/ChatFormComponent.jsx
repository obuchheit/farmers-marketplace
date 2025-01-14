import { useState } from 'react';
import { Form  } from 'react-bootstrap';
import Button from "react-bootstrap/Button";

const ChatFormComponent = ({ messageInput, handleInputChange, handleSubmit}) => {

  return (
    <>
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
};

export default ChatFormComponent;
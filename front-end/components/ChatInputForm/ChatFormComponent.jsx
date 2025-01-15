import { useEffect, useRef } from 'react';
import { Form  } from 'react-bootstrap';
import './ChatFormComponent.css'

const ChatFormComponent = ({ messageInput, handleInputChange, handleSubmit}) => {
  const textareaRef = useRef(null);  

    // Function to adjust the height of the textarea dynamically
  const handleResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset the height to 'auto' to shrink the textarea when content is deleted
      textarea.style.height = 'auto';
      // Set the height to the scrollHeight to accommodate the content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Use effect to adjust the height when the messageInput changes
  useEffect(() => {
    handleResize(); // Resize the textarea based on content
  }, [messageInput]);

  return (
    <>
      <Form onSubmit={handleSubmit} className='chat-form'>
        <div className='text-area-container'>
          <textarea 
            ref={textareaRef}
            value={messageInput}
            onChange={handleInputChange}
            rows="1"
            placeholder='Type a message...'
            className='text-area'
          />       
        </div>
          <button type='submit' className='send-button' disabled={!messageInput.trim()}>
            Send
          </button>
      </Form>
    </>
  )
};

export default ChatFormComponent;
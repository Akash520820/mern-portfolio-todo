import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChatBubble = () => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDismissed(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="chat-bubble">
      {!dismissed && (
        <Link to="/todos" className="chat-bubble__hint">
          <span>😊</span> Try the todo app
        </Link>
      )}
      <Link to="/todos" className="chat-bubble__fab" aria-label="Open the todo app">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M4 4h16v12H7l-3 3V4Z" />
        </svg>
      </Link>
    </div>
  );
};

export default ChatBubble;

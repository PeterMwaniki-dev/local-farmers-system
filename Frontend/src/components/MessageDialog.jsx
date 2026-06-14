import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMessageThread, sendMessage } from '../services/messageService';

const MessageDialog = ({ isOpen, onClose, receiverId, receiverName, produceName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && receiverId) {
      loadThread();
    }
  }, [isOpen, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const notifyUnreadUpdate = () => {
    window.dispatchEvent(new Event('messages-updated'));
  };

  const loadThread = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getMessageThread(receiverId);
      setMessages(response.data?.messages || []);
      notifyUnreadUpdate();
    } catch (err) {
      setError(err.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      setError('');
      const subject = produceName ? `Inquiry about ${produceName}` : undefined;
      const response = await sendMessage({
        receiver_id: receiverId,
        message_text: newMessage.trim(),
        subject
      });

      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');
      notifyUnreadUpdate();
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-green-50 rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Message {receiverName}</h3>
            {produceName && (
              <p className="text-sm text-gray-600">About: {produceName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-[200px]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto" />
              <p className="text-gray-500 mt-2 text-sm">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">
              No messages yet. Send a message to start the conversation.
            </p>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === user?.user_id;
              return (
                <div
                  key={msg.message_id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      isMine
                        ? 'bg-green-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    <p>{msg.message_text}</p>
                    <p className={`text-xs mt-1 ${isMine ? 'text-green-100' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="mx-5 mb-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="px-5 py-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              {sending ? '...' : 'Send'}
            </button>
          </div>
          <Link
            to={`/messages?user=${receiverId}`}
            onClick={onClose}
            className="inline-block mt-2 text-sm text-green-600 hover:text-green-700"
          >
            Open full inbox →
          </Link>
        </form>
      </div>
    </div>
  );
};

export default MessageDialog;

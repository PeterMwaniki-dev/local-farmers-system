import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import {
  getConversations,
  getMessageThread,
  sendMessage
} from '../services/messageService';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchInbox();
  }, []);

  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId) {
      openThread(Number(userId));
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const notifyUnreadUpdate = () => {
    window.dispatchEvent(new Event('messages-updated'));
  };

  const fetchInbox = async () => {
    try {
      setLoadingInbox(true);
      const response = await getConversations();
      setConversations(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoadingInbox(false);
    }
  };

  const openThread = async (partnerId, partnerInfo = null) => {
    try {
      setLoadingThread(true);
      setError('');
      setSearchParams({ user: String(partnerId) });

      const response = await getMessageThread(partnerId);
      const partner = response.data?.partner || partnerInfo;
      setSelectedPartner(partner);
      setMessages(response.data?.messages || []);
      notifyUnreadUpdate();
      await fetchInbox();
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoadingThread(false);
    }
  };

  const handleSelectConversation = (conv) => {
    openThread(conv.partner_id, {
      user_id: conv.partner_id,
      full_name: conv.partner_name,
      user_type: conv.partner_type
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner || sending) return;

    try {
      setSending(true);
      setError('');
      const response = await sendMessage({
        receiver_id: selectedPartner.user_id,
        message_text: newMessage.trim()
      });

      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');
      notifyUnreadUpdate();
      await fetchInbox();
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
          <p className="text-gray-600 mt-1">
            {user?.user_type === 'farmer'
              ? 'Reply to buyers and experts who contact you about your produce.'
              : 'Chat with farmers about produce listings.'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          {/* Inbox list */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
              Conversations
            </div>

            {loadingInbox ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-center text-gray-500 py-12 px-4 text-sm">
                No conversations yet. Message a farmer from the Browse Produce page.
              </p>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.partner_id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full text-left px-4 py-3 hover:bg-green-50 transition ${
                      selectedPartner?.user_id === conv.partner_id ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-800">{conv.partner_name}</p>
                      {conv.unread_count > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 capitalize">{conv.partner_type}</p>
                    <p className="text-sm text-gray-600 truncate mt-1">{conv.last_message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.last_message_at).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Thread */}
          <div className="flex-1 flex flex-col">
            {!selectedPartner ? (
              <div className="flex-1 flex items-center justify-center text-gray-500 p-8 text-center">
                Select a conversation to view messages
              </div>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-gray-200 bg-green-50">
                  <h2 className="font-bold text-gray-800">{selectedPartner.full_name}</h2>
                  <p className="text-sm text-gray-600 capitalize">{selectedPartner.user_type}</p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-[300px]">
                  {loadingThread ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-8">
                      No messages yet. Say hello!
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
                            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
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

                <form onSubmit={handleSend} className="px-5 py-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-medium transition"
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

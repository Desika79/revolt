import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useDatabase, IndividualChat, IndividualMessage } from '@/hooks/useDatabase';
import { ArrowLeft, User, Plus, Send, MessageCircle, Users } from 'lucide-react';
import { format } from 'date-fns';

interface FindIndividualsPageProps {
  onBack: () => void;
}

const FindIndividualsPage: React.FC<FindIndividualsPageProps> = ({ onBack }) => {
  const [chats, setChats] = useState<IndividualChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<IndividualChat | null>(null);
  const [messages, setMessages] = useState<IndividualMessage[]>([]);
  const [newChatName, setNewChatName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateChat, setShowCreateChat] = useState(false);
  
  const { getIndividualChats, createIndividualChat, getIndividualMessages, addIndividualMessage } = useDatabase();

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
    }
  }, [selectedChat]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const chatData = await getIndividualChats();
      setChats(chatData || []);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedChat) return;
    
    try {
      const messageData = await getIndividualMessages(selectedChat.id);
      setMessages(messageData || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleCreateChat = async () => {
    if (!newChatName.trim()) return;
    
    try {
      const chat = await createIndividualChat(newChatName.trim());
      setChats(prev => [chat, ...prev]);
      setNewChatName('');
      setShowCreateChat(false);
      setSelectedChat(chat);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userName.trim() || !selectedChat) return;
    
    try {
      const message = await addIndividualMessage(selectedChat.id, newMessage.trim(), userName.trim());
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleJoinChat = (chat: IndividualChat) => {
    setSelectedChat(chat);
  };

  const handleLeaveChat = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-ambient-primary flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-whisper-mist bg-ambient-secondary">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLeaveChat}
            className="text-cyber-purple hover:bg-whisper-mist"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-cyber-purple/20 flex items-center justify-center">
              <span className="text-cyber-purple font-semibold">
                {selectedChat.participant_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-whisper-float">{selectedChat.participant_name}</h2>
              <p className="text-sm text-whisper-mist">
                Started {format(new Date(selectedChat.created_at), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-cyber-purple border-cyber-purple">
            {messages.length} messages
          </Badge>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-whisper-mist mx-auto mb-4" />
                <p className="text-whisper-mist">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <Card key={message.id} className="bg-ambient-secondary border-whisper-mist">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center">
                        <span className="text-cyber-purple font-semibold text-sm">
                          {message.sender_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-whisper-float">{message.sender_name}</span>
                          <span className="text-xs text-whisper-mist">
                            {format(new Date(message.created_at), 'HH:mm')}
                          </span>
                        </div>
                        <p className="text-whisper-float">{message.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-whisper-mist bg-ambient-secondary">
          {!userName ? (
            <div className="flex gap-2">
              <Input
                placeholder="Enter your name to join the conversation..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="flex-1 bg-ambient-primary border-whisper-mist text-whisper-float"
                onKeyPress={(e) => e.key === 'Enter' && userName.trim() && setUserName(userName.trim())}
              />
              <Button
                onClick={() => userName.trim() && setUserName(userName.trim())}
                disabled={!userName.trim()}
                className="bg-cyber-purple text-ambient-primary hover:bg-cyber-purple/80"
              >
                Join
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-ambient-primary border-whisper-mist text-whisper-float"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-cyber-purple text-ambient-primary hover:bg-cyber-purple/80"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ambient-primary">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-whisper-mist bg-ambient-secondary">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-cyber-purple hover:bg-whisper-mist"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <User className="h-6 w-6 text-cyber-purple" />
          <h1 className="text-2xl font-bold text-whisper-float">Find Individuals</h1>
        </div>
        <Button
          onClick={() => setShowCreateChat(true)}
          className="bg-cyber-purple text-ambient-primary hover:bg-cyber-purple/80"
        >
          <Plus className="h-4 w-4 mr-2" />
          Start Chat
        </Button>
      </div>

      {/* Create Chat Modal */}
      {showCreateChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-ambient-secondary border-whisper-mist">
            <CardHeader>
              <CardTitle className="text-whisper-float">Start Individual Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter participant name..."
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                className="bg-ambient-primary border-whisper-mist text-whisper-float"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateChat()}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateChat(false);
                    setNewChatName('');
                  }}
                  className="flex-1 border-whisper-mist text-whisper-float hover:bg-whisper-mist/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateChat}
                  disabled={!newChatName.trim()}
                  className="flex-1 bg-cyber-purple text-ambient-primary hover:bg-cyber-purple/80"
                >
                  Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat List */}
      <ScrollArea className="h-[calc(100vh-80px)] p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-cyber-purple border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-whisper-mist">Loading individuals...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-whisper-mist mx-auto mb-4" />
            <p className="text-whisper-mist mb-2">No individual chats available</p>
            <p className="text-sm text-whisper-mist">Start the first chat to connect with someone</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className="bg-ambient-secondary border-whisper-mist hover:border-cyber-purple transition-colors cursor-pointer"
                onClick={() => handleJoinChat(chat)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyber-purple/20 flex items-center justify-center">
                        <span className="text-cyber-purple font-semibold">
                          {chat.participant_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <CardTitle className="text-whisper-float text-lg">{chat.participant_name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-cyber-purple border-cyber-purple">
                      Individual
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-whisper-mist">
                    <span>Started {format(new Date(chat.created_at), 'MMM dd, HH:mm')}</span>
                    <span>•</span>
                    <span>Click to chat</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default FindIndividualsPage;
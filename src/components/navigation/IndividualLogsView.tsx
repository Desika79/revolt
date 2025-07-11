import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useDatabase, IndividualChat, IndividualMessage } from '@/hooks/useDatabase';
import { ArrowLeft, MessageCircle, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface IndividualLogsViewProps {
  onBack: () => void;
}

const IndividualLogsView: React.FC<IndividualLogsViewProps> = ({ onBack }) => {
  const [chats, setChats] = useState<IndividualChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<IndividualChat | null>(null);
  const [messages, setMessages] = useState<IndividualMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { getIndividualChats, getIndividualMessages } = useDatabase();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const chatData = await getIndividualChats();
      setChats(chatData || []);
    } catch (error) {
      console.error('Error loading individual chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatMessages = async (chat: IndividualChat) => {
    try {
      setSelectedChat(chat);
      const messageData = await getIndividualMessages(chat.id);
      setMessages(messageData || []);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  if (selectedChat) {
    return (
      <div className="h-full flex flex-col bg-ambient-primary">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-whisper-mist">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToChats}
            className="text-cyber-cyan hover:bg-whisper-mist"
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
                <p className="text-whisper-mist">No messages in this chat yet</p>
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
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-ambient-primary">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-whisper-mist">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-cyber-cyan hover:bg-whisper-mist"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-cyber-purple" />
          <h1 className="text-2xl font-bold text-whisper-float">Individual Logs</h1>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-cyber-purple border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-whisper-mist">Loading individual logs...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-whisper-mist mx-auto mb-4" />
            <p className="text-whisper-mist mb-2">No individual logs found</p>
            <p className="text-sm text-whisper-mist">
              One-on-one conversations will appear here after you start individual chats
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className="bg-ambient-secondary border-whisper-mist hover:border-cyber-purple transition-colors cursor-pointer"
                onClick={() => loadChatMessages(chat)}
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
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Started {format(new Date(chat.created_at), 'MMM dd, HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>View messages</span>
                    </div>
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

export default IndividualLogsView;
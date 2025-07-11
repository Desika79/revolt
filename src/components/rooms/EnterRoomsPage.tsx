import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useDatabase, Room, RoomMessage } from '@/hooks/useDatabase';
import { ArrowLeft, Users, Plus, Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

interface EnterRoomsPageProps {
  onBack: () => void;
}

const EnterRoomsPage: React.FC<EnterRoomsPageProps> = ({ onBack }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  
  const { getRooms, createRoom, getRoomMessages, addRoomMessage } = useDatabase();

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages();
    }
  }, [selectedRoom]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const roomData = await getRooms();
      setRooms(roomData || []);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedRoom) return;
    
    try {
      const messageData = await getRoomMessages(selectedRoom.id);
      setMessages(messageData || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    
    try {
      const room = await createRoom(newRoomName.trim());
      setRooms(prev => [room, ...prev]);
      setNewRoomName('');
      setShowCreateRoom(false);
      setSelectedRoom(room);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userName.trim() || !selectedRoom) return;
    
    try {
      const message = await addRoomMessage(selectedRoom.id, newMessage.trim(), userName.trim());
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleJoinRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
    setMessages([]);
  };

  if (selectedRoom) {
    return (
      <div className="min-h-screen bg-ambient-primary flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-whisper-mist bg-ambient-secondary">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLeaveRoom}
            className="text-cyber-cyan hover:bg-whisper-mist"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-whisper-float">{selectedRoom.name}</h2>
            <p className="text-sm text-whisper-mist">
              Created {format(new Date(selectedRoom.created_at), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
          <Badge variant="outline" className="text-cyber-cyan border-cyber-cyan">
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
                      <div className="w-8 h-8 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                        <span className="text-cyber-cyan font-semibold text-sm">
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
                className="bg-cyber-cyan text-ambient-primary hover:bg-cyber-cyan/80"
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
                className="bg-cyber-cyan text-ambient-primary hover:bg-cyber-cyan/80"
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
          className="text-cyber-cyan hover:bg-whisper-mist"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <Users className="h-6 w-6 text-cyber-cyan" />
          <h1 className="text-2xl font-bold text-whisper-float">Enter Rooms</h1>
        </div>
        <Button
          onClick={() => setShowCreateRoom(true)}
          className="bg-cyber-cyan text-ambient-primary hover:bg-cyber-cyan/80"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-ambient-secondary border-whisper-mist">
            <CardHeader>
              <CardTitle className="text-whisper-float">Create New Room</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="bg-ambient-primary border-whisper-mist text-whisper-float"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateRoom(false);
                    setNewRoomName('');
                  }}
                  className="flex-1 border-whisper-mist text-whisper-float hover:bg-whisper-mist/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateRoom}
                  disabled={!newRoomName.trim()}
                  className="flex-1 bg-cyber-cyan text-ambient-primary hover:bg-cyber-cyan/80"
                >
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Room List */}
      <ScrollArea className="h-[calc(100vh-80px)] p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-whisper-mist">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-whisper-mist mx-auto mb-4" />
            <p className="text-whisper-mist mb-2">No rooms available</p>
            <p className="text-sm text-whisper-mist">Create the first room to start conversations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="bg-ambient-secondary border-whisper-mist hover:border-cyber-cyan transition-colors cursor-pointer"
                onClick={() => handleJoinRoom(room)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-whisper-float text-lg">{room.name}</CardTitle>
                    <Badge variant="outline" className="text-cyber-cyan border-cyber-cyan">
                      Room
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-whisper-mist">
                    <span>Created {format(new Date(room.created_at), 'MMM dd, HH:mm')}</span>
                    <span>•</span>
                    <span>Click to join</span>
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

export default EnterRoomsPage;
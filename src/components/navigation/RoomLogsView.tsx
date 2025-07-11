import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useDatabase, Room, RoomMessage } from '@/hooks/useDatabase';
import { ArrowLeft, MessageCircle, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface RoomLogsViewProps {
  onBack: () => void;
}

const RoomLogsView: React.FC<RoomLogsViewProps> = ({ onBack }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { getRooms, getRoomMessages } = useDatabase();

  useEffect(() => {
    loadRooms();
  }, []);

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

  const loadRoomMessages = async (room: Room) => {
    try {
      setSelectedRoom(room);
      const messageData = await getRoomMessages(room.id);
      setMessages(messageData || []);
    } catch (error) {
      console.error('Error loading room messages:', error);
    }
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
    setMessages([]);
  };

  if (selectedRoom) {
    return (
      <div className="h-full flex flex-col bg-ambient-primary">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-whisper-mist">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToRooms}
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
                <p className="text-whisper-mist">No messages in this room yet</p>
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
          <Users className="h-6 w-6 text-cyber-cyan" />
          <h1 className="text-2xl font-bold text-whisper-float">Room Logs</h1>
        </div>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-whisper-mist">Loading room logs...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-whisper-mist mx-auto mb-4" />
            <p className="text-whisper-mist mb-2">No room logs found</p>
            <p className="text-sm text-whisper-mist">
              Room conversations will appear here after you join or create rooms
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="bg-ambient-secondary border-whisper-mist hover:border-cyber-cyan transition-colors cursor-pointer"
                onClick={() => loadRoomMessages(room)}
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
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Created {format(new Date(room.created_at), 'MMM dd, HH:mm')}</span>
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

export default RoomLogsView;
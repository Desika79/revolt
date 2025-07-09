-- Create tables for room and individual chat functionality with auto-cleanup

-- Rooms table to track unique rooms
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

-- Room messages table
CREATE TABLE public.room_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual chats table to track unique chat sessions
CREATE TABLE public.individual_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_name TEXT NOT NULL,
  participant_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

-- Individual chat messages table
CREATE TABLE public.individual_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.individual_chats(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.individual_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.individual_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create rooms" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view room messages" ON public.room_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can create room messages" ON public.room_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view individual chats" ON public.individual_chats FOR SELECT USING (true);
CREATE POLICY "Anyone can create individual chats" ON public.individual_chats FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view individual messages" ON public.individual_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can create individual messages" ON public.individual_messages FOR INSERT WITH CHECK (true);

-- Function to clean up expired rooms and chats
CREATE OR REPLACE FUNCTION public.cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Delete expired rooms (cascade will delete messages)
  DELETE FROM public.rooms WHERE expires_at < now();
  
  -- Delete expired individual chats (cascade will delete messages)
  DELETE FROM public.individual_chats WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_rooms_expires_at ON public.rooms(expires_at);
CREATE INDEX idx_individual_chats_expires_at ON public.individual_chats(expires_at);
CREATE INDEX idx_room_messages_room_id ON public.room_messages(room_id);
CREATE INDEX idx_individual_messages_chat_id ON public.individual_messages(chat_id);
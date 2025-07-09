import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Room {
  id: string;
  name: string;
  created_at: string;
  expires_at: string;
}

export interface RoomMessage {
  id: string;
  room_id: string;
  message: string;
  sender_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface IndividualChat {
  id: string;
  participant_name: string;
  participant_avatar?: string;
  created_at: string;
  expires_at: string;
}

export interface IndividualMessage {
  id: string;
  chat_id: string;
  message: string;
  sender_name: string;
  avatar_url?: string;
  created_at: string;
}

export function useDatabase() {
  // Room operations
  const createRoom = async (name: string) => {
    const { data, error } = await supabase
      .from('rooms')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const getRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const getRoomMessages = async (roomId: string) => {
    const { data, error } = await supabase
      .from('room_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  };

  const addRoomMessage = async (roomId: string, message: string, senderName: string, avatarUrl?: string) => {
    const { data, error } = await supabase
      .from('room_messages')
      .insert([{
        room_id: roomId,
        message,
        sender_name: senderName,
        avatar_url: avatarUrl
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  // Individual chat operations
  const createIndividualChat = async (participantName: string, participantAvatar?: string) => {
    const { data, error } = await supabase
      .from('individual_chats')
      .insert([{ 
        participant_name: participantName,
        participant_avatar: participantAvatar
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const getIndividualChats = async () => {
    const { data, error } = await supabase
      .from('individual_chats')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const getIndividualMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from('individual_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  };

  const addIndividualMessage = async (chatId: string, message: string, senderName: string, avatarUrl?: string) => {
    const { data, error } = await supabase
      .from('individual_messages')
      .insert([{
        chat_id: chatId,
        message,
        sender_name: senderName,
        avatar_url: avatarUrl
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  // Cleanup expired data
  const cleanupExpiredData = async () => {
    const { error } = await supabase.rpc('cleanup_expired_data');
    if (error) throw error;
  };

  return {
    createRoom,
    getRooms,
    getRoomMessages,
    addRoomMessage,
    createIndividualChat,
    getIndividualChats,
    getIndividualMessages,
    addIndividualMessage,
    cleanupExpiredData
  };
}
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, MessageSquare, ArrowLeft, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  updated_at: string;
  other_user?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
  };
  last_message?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const fetchConversations = async () => {
    if (!user) return;
    const { data: convos } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .order('updated_at', { ascending: false });

    if (!convos) { setLoading(false); return; }

    const enriched = await Promise.all(
      convos.map(async (c: any) => {
        const otherId = c.participant_1 === user.id ? c.participant_2 : c.participant_1;
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role')
          .eq('id', otherId)
          .single();

        const { data: lastMsg } = await supabase
          .from('messages')
          .select('content')
          .eq('conversation_id', c.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', c.id)
          .eq('is_read', false)
          .neq('sender_id', user.id);

        return {
          ...c,
          other_user: profile,
          last_message: lastMsg?.[0]?.content || '',
          unread_count: count || 0,
        };
      })
    );

    setConversations(enriched);
    setLoading(false);
  };

  const fetchMessages = async (convoId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convoId)
      .order('created_at', { ascending: true });
    setMessages(data || []);

    // Mark as read
    if (user) {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', convoId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!activeConvo) return;
    fetchMessages(activeConvo.id);

    const channel = supabase
      .channel(`messages-${activeConvo.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConvo.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        // Mark as read if we're viewing
        if (user && (payload.new as Message).sender_id !== user.id) {
          supabase.from('messages').update({ is_read: true }).eq('id', (payload.new as Message).id);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeConvo?.id, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConvo || !user) return;
    const content = newMessage.trim();
    setNewMessage('');

    await supabase.from('messages').insert({
      conversation_id: activeConvo.id,
      sender_id: user.id,
      content,
    });

    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', activeConvo.id);
  };

  const searchUsers = async (query: string) => {
    setNewChatSearch(query);
    if (query.length < 2) { setSearchResults([]); return; }
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .neq('id', user?.id || '')
      .ilike('full_name', `%${query}%`)
      .limit(10);
    setSearchResults(data || []);
  };

  const startConversation = async (otherUserId: string) => {
    if (!user) return;

    // Check if conversation exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant_1.eq.${user.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user.id})`);

    if (existing && existing.length > 0) {
      const convo = existing[0];
      setNewChatOpen(false);
      await fetchConversations();
      const enriched = conversations.find(c => c.id === convo.id);
      if (enriched) {
        setActiveConvo(enriched);
        setMobileShowChat(true);
      }
      return;
    }

    const { data: newConvo, error } = await supabase
      .from('conversations')
      .insert({ participant_1: user.id, participant_2: otherUserId })
      .select()
      .single();

    if (error) {
      toast.error('Could not start conversation');
      return;
    }

    setNewChatOpen(false);
    await fetchConversations();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .eq('id', otherUserId)
      .single();

    setActiveConvo({ ...newConvo, other_user: profile, last_message: '', unread_count: 0 });
    setMobileShowChat(true);
  };

  const selectConvo = (convo: Conversation) => {
    setActiveConvo(convo);
    setMobileShowChat(true);
  };

  const filteredConversations = conversations.filter(c =>
    !searchQuery || c.other_user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      <div className="container max-w-5xl py-4">
        <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)] rounded-xl border bg-card overflow-hidden">
          {/* Sidebar */}
          <div className={`w-full md:w-80 lg:w-96 border-r flex flex-col ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Messages</h2>
                <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Conversation</DialogTitle>
                    </DialogHeader>
                    <Input
                      placeholder="Search by name..."
                      value={newChatSearch}
                      onChange={e => searchUsers(e.target.value)}
                    />
                    <div className="max-h-64 overflow-y-auto space-y-1 mt-2">
                      {searchResults.map(u => (
                        <button
                          key={u.id}
                          onClick={() => startConversation(u.id)}
                          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-accent transition-colors text-left"
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={u.avatar_url || ''} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {u.full_name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{u.full_name || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground capitalize">{u.role}</div>
                          </div>
                        </button>
                      ))}
                      {newChatSearch.length >= 2 && searchResults.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Start a new chat to connect!</p>
                </div>
              ) : (
                filteredConversations.map(convo => (
                  <button
                    key={convo.id}
                    onClick={() => selectConvo(convo)}
                    className={`flex items-center gap-3 w-full p-4 hover:bg-accent/50 transition-colors text-left border-b ${
                      activeConvo?.id === convo.id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={convo.other_user?.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {convo.other_user?.full_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      {(convo.unread_count ?? 0) > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                          {convo.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold truncate">{convo.other_user?.full_name || 'Unknown'}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {convo.updated_at && formatDistanceToNow(new Date(convo.updated_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{convo.last_message || 'No messages yet'}</p>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
            {activeConvo ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 p-4 border-b">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:hidden"
                    onClick={() => { setMobileShowChat(false); fetchConversations(); }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activeConvo.other_user?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {activeConvo.other_user?.full_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold">{activeConvo.other_user?.full_name || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground capitalize">{activeConvo.other_user?.role}</div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-12">
                        Start the conversation by sending a message!
                      </p>
                    )}
                    {messages.map(msg => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-accent text-accent-foreground rounded-bl-md'
                          }`}>
                            <p>{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                              {msg.created_at && formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <form
                    onSubmit={e => { e.preventDefault(); sendMessage(); }}
                    className="flex gap-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Your Messages</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Select a conversation or start a new one to connect with students, alumni, and staff.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

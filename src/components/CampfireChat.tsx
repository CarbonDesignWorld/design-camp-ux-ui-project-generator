import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Send, Flame } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  user_name?: string;
}

const CampfireChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        async (payload) => {
          const newMsg = payload.new as ChatMessage;
          // Fetch user name for the new message
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", newMsg.user_id)
            .maybeSingle();
          
          setMessages((prev) => [
            ...prev,
            { ...newMsg, user_name: profile?.name || "Camper" },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) throw error;

      // Fetch user names for all messages
      const userIds = [...new Set(data?.map((m) => m.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", userIds);

      const profileMap = new Map(
        profiles?.map((p) => [p.user_id, p.name]) || []
      );

      const messagesWithNames = (data || []).map((m) => ({
        ...m,
        user_name: profileMap.get(m.user_id) || "Camper",
      }));

      setMessages(messagesWithNames);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase.from("chat_messages").insert({
        user_id: user.id,
        message: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
          <Flame className="w-10 h-10 text-secondary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Join the Campfire
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Log in to chat with fellow designers and share your journey around the campfire.
        </p>
        <Link to="/login">
          <Button variant="camp" size="lg">
            Log In to Chat
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 radius-lg">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">
              Loading messages...
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Flame className="w-12 h-12 text-secondary/50 mb-4" />
            <p className="text-muted-foreground">
              Be the first to start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.user_id === user.id ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-3 radius-md ${
                  msg.user_id === user.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="font-medium">
                  {msg.user_id === user.id ? "You" : msg.user_name}
                </span>
                <span>•</span>
                <span>
                  {format(new Date(msg.created_at), "h:mm a")}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="flex gap-2 p-4 border-t border-border"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Share your thoughts with the camp..."
          className="flex-1"
          disabled={sending}
        />
        <Button
          type="submit"
          variant="camp"
          disabled={!newMessage.trim() || sending}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default CampfireChat;

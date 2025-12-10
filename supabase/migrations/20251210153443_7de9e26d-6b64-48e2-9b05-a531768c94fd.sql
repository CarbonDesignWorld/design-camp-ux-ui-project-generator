-- Create chat messages table for campfire community
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Everyone can read messages
CREATE POLICY "Chat messages are publicly readable"
ON public.chat_messages
FOR SELECT
USING (true);

-- Logged in users can insert their own messages
CREATE POLICY "Users can insert own messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
ON public.chat_messages
FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Make submissions publicly readable for the gallery
CREATE POLICY "Submissions are publicly readable"
ON public.submissions
FOR SELECT
USING (true);
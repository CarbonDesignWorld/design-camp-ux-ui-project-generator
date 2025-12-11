-- Create newsletter signups table
CREATE TABLE public.newsletter_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  challenge_reminders BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can sign up)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_signups
FOR INSERT
WITH CHECK (true);

-- Prevent reading other signups (admin only via service role)
CREATE POLICY "Users cannot read signups"
ON public.newsletter_signups
FOR SELECT
USING (false);
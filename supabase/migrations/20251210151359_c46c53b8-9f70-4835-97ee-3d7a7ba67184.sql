-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL,
  time_estimate TEXT,
  example_outputs TEXT[],
  challenge_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Challenges are publicly readable
CREATE POLICY "Challenges are publicly readable"
ON public.challenges
FOR SELECT
USING (true);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  image_urls TEXT[],
  figma_link TEXT,
  external_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
ON public.submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
ON public.submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions
CREATE POLICY "Users can update own submissions"
ON public.submissions
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own submissions
CREATE POLICY "Users can delete own submissions"
ON public.submissions
FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket for submission images
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', true);

-- Storage policies for submissions bucket
CREATE POLICY "Users can upload submission images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Submission images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'submissions');

CREATE POLICY "Users can update own submission images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own submission images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Seed some challenge data
INSERT INTO public.challenges (title, description, full_description, difficulty, category, time_estimate, challenge_date) VALUES
('Design a Mobile Onboarding Flow', 
 'Create a 3-5 screen onboarding experience for a meditation app.',
 'Design a calming, intuitive onboarding experience that introduces users to a meditation app''s core features. Focus on creating a peaceful aesthetic that reduces anxiety and encourages users to complete the setup process.\n\n**Requirements:**\n- 3-5 screens covering welcome, feature highlights, and account setup\n- Calming color palette and imagery\n- Clear progress indicators\n- Skip option for experienced users\n- Accessibility considerations',
 'Beginner', 'UX', '30-45 min', CURRENT_DATE),
('Animated Loading State',
 'Design a delightful loading animation that keeps users engaged.',
 'Create an engaging loading animation that transforms wait time into a positive experience. The animation should be smooth, branded, and give users feedback about progress.\n\n**Requirements:**\n- Looping animation under 3 seconds\n- Brand-appropriate style\n- Works on both light and dark backgrounds\n- Includes subtle progress indication\n- Exports as Lottie or CSS animation',
 'Intermediate', 'Microinteraction', '1-2 hours', CURRENT_DATE - INTERVAL '1 day'),
('SaaS Pricing Page',
 'Create a conversion-focused pricing page with tier comparison.',
 'Design a pricing page that clearly communicates value and drives conversions. Include multiple pricing tiers with clear differentiation and a toggle for monthly/annual billing.\n\n**Requirements:**\n- 3-4 pricing tiers with clear hierarchy\n- Monthly/annual toggle with savings highlighted\n- Feature comparison table\n- FAQ section addressing common objections\n- Mobile-responsive design\n- Clear primary CTA',
 'Advanced', 'Landing Page', '2-4 hours', CURRENT_DATE - INTERVAL '2 days'),
('Dark Mode Toggle',
 'Design a smooth dark/light mode toggle with animated transition.',
 'Create an elegant theme toggle that smoothly transitions between light and dark modes. The animation should be satisfying and provide clear feedback.\n\n**Requirements:**\n- Smooth transition animation\n- Clear visual indication of current mode\n- Works as a standalone component\n- Accessible (keyboard navigable, proper ARIA labels)\n- Consider system preference detection',
 'Beginner', 'Microinteraction', '30-45 min', CURRENT_DATE - INTERVAL '3 days'),
('E-commerce Product Card',
 'Design an interactive product card with hover states and quick-add.',
 'Create a product card component that showcases items effectively and encourages interaction. Include hover states, quick actions, and key product information.\n\n**Requirements:**\n- Product image with zoom on hover\n- Quick-add to cart functionality\n- Wishlist/favorite toggle\n- Price with sale indication\n- Rating display\n- Color/size variant preview',
 'Intermediate', 'UI', '1-2 hours', CURRENT_DATE - INTERVAL '4 days');
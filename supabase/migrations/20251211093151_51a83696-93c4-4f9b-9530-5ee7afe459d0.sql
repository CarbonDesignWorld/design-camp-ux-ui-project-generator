-- Create project templates table
CREATE TABLE public.project_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deliverables TEXT[] NOT NULL,
  tools_recommended TEXT[] NOT NULL,
  time_estimate TEXT NOT NULL,
  example_challenges TEXT[] NOT NULL,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  project_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  duration TEXT NOT NULL CHECK (duration IN ('quick-fire', 'short-sprint', 'full-project')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;

-- Projects are publicly readable
CREATE POLICY "Project templates are publicly readable"
ON public.project_templates
FOR SELECT
USING (true);

-- Insert sample project templates
INSERT INTO public.project_templates (title, description, deliverables, tools_recommended, time_estimate, example_challenges, skill_level, project_type, platform, duration) VALUES
('Mobile Banking App Redesign', 'Redesign a mobile banking app focusing on simplifying the transfer flow and improving accessibility.', ARRAY['User flow diagram', 'Hi-fi mockups (5+ screens)', 'Prototype with interactions'], ARRAY['Figma', 'FigJam', 'Stark Plugin'], '4-6 hours', ARRAY['Must support voice-over navigation', 'Include biometric authentication flow', 'Design for users 60+ years old'], 'intermediate', 'UI', 'Mobile', 'short-sprint'),
('E-commerce Checkout Wireframes', 'Create low-fidelity wireframes for a streamlined checkout experience with guest checkout option.', ARRAY['Wireframe screens (8-10)', 'Annotation document', 'User flow'], ARRAY['Figma', 'Whimsical', 'Miro'], '2-3 hours', ARRAY['Maximum 3 steps to purchase', 'Include error states', 'Mobile-first approach'], 'beginner', 'Wireframe', 'Responsive', 'quick-fire'),
('SaaS Dashboard Research', 'Conduct competitive analysis and user research for a project management dashboard.', ARRAY['Competitive analysis report', 'User persona (2)', 'Journey map', 'Research findings deck'], ARRAY['Notion', 'Miro', 'Dovetail', 'Google Forms'], '8-12 hours', ARRAY['Interview 3-5 users', 'Analyze 4 competitors', 'Identify 5 key pain points'], 'advanced', 'Research', 'Desktop', 'full-project'),
('Micro-interaction Collection', 'Design 5 delightful micro-interactions for common UI actions.', ARRAY['5 animated prototypes', 'Documentation of timing/easing'], ARRAY['Figma', 'Principle', 'After Effects', 'Lottie'], '3-4 hours', ARRAY['Include success state animation', 'Button hover effect', 'Loading indicator'], 'intermediate', 'Microinteraction', 'Responsive', 'short-sprint'),
('Food Delivery App Prototype', 'Build an interactive prototype for a food delivery app with ordering and tracking flows.', ARRAY['Interactive prototype', 'Screen designs (12+)', 'Component library'], ARRAY['Figma', 'ProtoPie', 'Maze'], '6-8 hours', ARRAY['Include real-time order tracking', 'Design for one-handed use', 'Gamify the waiting experience'], 'advanced', 'Prototype', 'Mobile', 'full-project'),
('Portfolio Website Wireframes', 'Create wireframes for a designer portfolio with case study template.', ARRAY['Desktop wireframes', 'Mobile wireframes', 'Case study template'], ARRAY['Figma', 'Sketch', 'Whimsical'], '1-2 hours', ARRAY['Highlight 3 projects', 'Include about section', 'Contact form design'], 'beginner', 'Wireframe', 'Desktop', 'quick-fire'),
('Health App Onboarding UX', 'Design a personalized onboarding experience for a fitness tracking app.', ARRAY['Onboarding flow (6-8 screens)', 'Personalization logic diagram', 'Hi-fi designs'], ARRAY['Figma', 'Notion', 'FigJam'], '4-5 hours', ARRAY['Collect user preferences without overwhelm', 'Include skip options', 'Progressive disclosure pattern'], 'intermediate', 'UX', 'Mobile', 'short-sprint'),
('Tablet POS System', 'Design a point-of-sale interface optimized for tablet use in retail.', ARRAY['Main dashboard', 'Transaction flow', 'Product catalog view', 'Receipt design'], ARRAY['Figma', 'Adobe XD'], '5-7 hours', ARRAY['Large touch targets', 'Works in bright lighting', 'Quick product search'], 'intermediate', 'UI', 'Tablet', 'short-sprint'),
('Design System Starter', 'Create foundational components for a design system.', ARRAY['Color palette', 'Typography scale', 'Button variants', 'Form elements', 'Documentation'], ARRAY['Figma', 'Storybook', 'Notion'], '10-15 hours', ARRAY['Support light/dark mode', 'WCAG AA compliant', 'Include usage guidelines'], 'advanced', 'UI', 'Responsive', 'full-project'),
('Quick Logo Concepts', 'Sketch 3 logo concepts for a sustainable fashion brand.', ARRAY['3 logo concepts', 'Color variations', 'Brief rationale'], ARRAY['Figma', 'Illustrator', 'Procreate'], '1 hour', ARRAY['Eco-friendly aesthetic', 'Works at small sizes', 'Memorable silhouette'], 'beginner', 'UI', 'Responsive', 'quick-fire'),
('User Testing Script', 'Prepare a moderated usability testing script and tasks.', ARRAY['Test script', 'Task scenarios (5)', 'Consent form', 'Findings template'], ARRAY['Notion', 'Google Docs', 'Lookback'], '2-3 hours', ARRAY['Test a checkout flow', 'Include think-aloud prompts', 'Measure task completion rate'], 'beginner', 'Research', 'Responsive', 'quick-fire'),
('Dashboard Data Viz', 'Design data visualization components for an analytics dashboard.', ARRAY['Chart components (6+)', 'Empty states', 'Loading states', 'Tooltip designs'], ARRAY['Figma', 'D3.js reference', 'Data viz guidelines'], '4-6 hours', ARRAY['Accessible color palette', 'Responsive charts', 'Interactive hover states'], 'advanced', 'UI', 'Desktop', 'short-sprint');
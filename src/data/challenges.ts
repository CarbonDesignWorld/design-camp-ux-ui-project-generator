export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'UX' | 'UI' | 'Microinteraction' | 'Landing Page' | 'Mobile';
  date: string;
}

export const pastChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Design a Mobile Onboarding Flow',
    description: 'Create a 3-5 screen onboarding experience for a fitness app that introduces key features.',
    difficulty: 'Beginner',
    category: 'UX',
    date: '2024-12-09',
  },
  {
    id: '2',
    title: 'Animated Loading State',
    description: 'Design a delightful loading animation that keeps users engaged while content loads.',
    difficulty: 'Intermediate',
    category: 'Microinteraction',
    date: '2024-12-08',
  },
  {
    id: '3',
    title: 'SaaS Pricing Page',
    description: 'Create a conversion-focused pricing page with tier comparison and toggle for monthly/annual.',
    difficulty: 'Advanced',
    category: 'Landing Page',
    date: '2024-12-07',
  },
  {
    id: '4',
    title: 'Dark Mode Toggle',
    description: 'Design a smooth dark/light mode toggle with animated transition effects.',
    difficulty: 'Beginner',
    category: 'Microinteraction',
    date: '2024-12-06',
  },
  {
    id: '5',
    title: 'E-commerce Product Card',
    description: 'Design an interactive product card with hover states, quick-add, and wishlist functionality.',
    difficulty: 'Intermediate',
    category: 'UI',
    date: '2024-12-05',
  },
  {
    id: '6',
    title: 'Mobile Navigation Menu',
    description: 'Create an intuitive bottom navigation or hamburger menu for a travel app.',
    difficulty: 'Beginner',
    category: 'Mobile',
    date: '2024-12-04',
  },
  {
    id: '7',
    title: 'Dashboard Analytics View',
    description: 'Design a data-rich dashboard with charts, KPIs, and filtering capabilities.',
    difficulty: 'Advanced',
    category: 'UX',
    date: '2024-12-03',
  },
  {
    id: '8',
    title: 'Button Hover Effects',
    description: 'Create 5 unique button hover animations that add personality to interactions.',
    difficulty: 'Beginner',
    category: 'Microinteraction',
    date: '2024-12-02',
  },
];

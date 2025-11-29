import { Issue, Poll } from './types';

export const INITIAL_ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Potholes on Main St.',
    description: 'Several large potholes are causing traffic delays and potential vehicle damage near the library.',
    category: 'Infrastructure',
    status: 'in-progress',
    date: '2023-10-25',
    location: { lat: 40, lng: 20 },
    upvotes: 45
  },
  {
    id: '2',
    title: 'Streetlight outage in Park District',
    description: 'Three consecutive streetlights are out, making the area unsafe at night.',
    category: 'Safety',
    status: 'submitted',
    date: '2023-10-26',
    location: { lat: 60, lng: 45 },
    upvotes: 12
  },
  {
    id: '3',
    title: 'Garbage collection missed',
    description: 'Weekly collection was missed for the entire block of Cedar Ave.',
    category: 'Sanitation',
    status: 'resolved',
    date: '2023-10-20',
    location: { lat: 25, lng: 70 },
    upvotes: 8
  },
  {
    id: '4',
    title: 'Noise complaint: Construction',
    description: 'Construction work starting before 6 AM in residential zone.',
    category: 'Noise',
    status: 'submitted',
    date: '2023-10-27',
    location: { lat: 80, lng: 30 },
    upvotes: 22
  }
];

export const INITIAL_POLLS: Poll[] = [
  {
    id: 'p1',
    question: 'Should we allocate budget for a new community park?',
    totalVotes: 1240,
    options: [
      { id: 'o1', text: 'Yes, absolutely', votes: 850 },
      { id: 'o2', text: 'No, fix roads first', votes: 300 },
      { id: 'o3', text: 'Undecided', votes: 90 }
    ]
  }
];

export const MOCK_LIVE_CHAT = [
  { user: 'Jane Doe', message: 'Will this affect property taxes?' },
  { user: 'John Smith', message: 'Great initiative!' },
  { user: 'Sam Wilson', message: 'When does construction start?' },
];

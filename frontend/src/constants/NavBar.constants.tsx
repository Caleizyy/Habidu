import {
  Book,
  Sunset,
  Trees,
  Zap,
  CalendarDays,
  Trophy,
  Medal,
  SquareCheckBig,
  CirclePile,
  Users,
  Handshake,
  NotebookTabs,
} from 'lucide-react';
import { MenuItem } from '../components/navbar';
import logo from '../assets/logoipsum-411.png';
import { ROUTES } from './Routes.constants';

export const DEFAULT_LOGO = {
  url: 'https://www.shadcnblocks.com',
  src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg',
  alt: 'logo',
  title: 'Shadcnblocks.com',
};

export const DEFAULT_MENU: MenuItem[] = [
  { title: 'Home', url: '#' },
  {
    title: 'Products',
    url: '#',
    items: [
      {
        title: 'Blog',
        description: 'The latest industry news, updates, and info',
        icon: <Book className="size-5 shrink-0" />,
        url: '#',
      },
      {
        title: 'Company',
        description: 'Our mission is to innovate and empower the world',
        icon: <Trees className="size-5 shrink-0" />,
        url: '#',
      },
      {
        title: 'Careers',
        description: 'Browse job listing and discover our workspace',
        icon: <Sunset className="size-5 shrink-0" />,
        url: '#',
      },
      {
        title: 'Support',
        description: 'Get in touch with our support team or visit our community forums',
        icon: <Zap className="size-5 shrink-0" />,
        url: '#',
      },
    ],
  },
  {
    title: 'Resources',
    url: '#',
    items: [
      {
        title: 'Help Center',
        description: 'Get all the answers you need right here',
        icon: <Zap className="size-5 shrink-0" />,
        url: '#',
      },
      {
        title: 'Contact Us',
        description: 'We are here to help you with any questions you have',
        icon: <Sunset className="size-5 shrink-0" />,
        url: '#',
      },
      {
        title: 'Status',
        description: 'Check the current status of our services and APIs',
        icon: <Trees className="size-5 shrink-0" />,
        url: '#',
      },
      {
        title: 'Terms of Service',
        description: 'Our terms and conditions for using our services',
        icon: <Book className="size-5 shrink-0" />,
        url: '#',
      },
    ],
  },
  {
    title: 'Pricing',
    url: '#',
  },
  {
    title: 'Blog',
    url: '#',
  },
];

export const DEFAULT_AUTH = {
  login: { title: 'Login', url: '#' },
  signup: { title: 'Sign up', url: '#' },
};

export const APP_LOGO = {
  url: ROUTES.HOME,
  src: logo,
  alt: 'Habit Tracker',
  title: 'Habit Tracker',
};

export const APP_MENU: MenuItem[] = [
  {
    title: 'Goals',
    url: '#',
    icon: <CalendarDays className="size-5" />,
    items: [
      {
        title: 'Habits',
        description: 'Create and manage your habits',
        url: ROUTES.HABITS,
        icon: <SquareCheckBig className="size-5" />,
      },
      {
        title: 'Tracking Habits',
        description: 'Track your habits',
        url: ROUTES.TRACKING,
        icon: <NotebookTabs className="size-5" />,
      },
      {
        title: 'Calendar',
        description: 'Plan your habit completion schedule',
        url: ROUTES.CALENDAR,
        icon: <CalendarDays className="size-5" />,
      },
    ],
  },
  {
    title: 'Progress',
    url: '#',
    items: [
      {
        title: 'Leaderboards',
        description: 'Compete with friends on the leaderboard',
        url: ROUTES.LEADERBOARDS,
        icon: <Medal className="size-5" />,
      },
      {
        title: 'Achievements',
        description: 'Unlock badges and earn milestones',
        url: ROUTES.ACHIEVEMENTS,
        icon: <Trophy className="size-5" />,
      },
    ],
  },
  {
    title: 'Connect',
    url: '#',
    items: [
      {
        title: 'Friends',
        description: 'Manage your friend connections',
        url: ROUTES.FRIENDS,
        icon: <Users className="size-5" />,
      },
      {
        title: 'Requests',
        description: 'Accept or decline friend requests',
        url: ROUTES.REQUESTS,
        icon: <Handshake className="size-5" />,
      },
      {
        title: 'Groups',
        description: 'Create and join habit groups with friends',
        url: ROUTES.GROUPS,
        icon: <CirclePile className="size-5" />,
      },
    ],
  },
  { title: 'About', url: ROUTES.ABOUT },
];

export const APP_AUTH = {
  login: { title: 'Login', url: ROUTES.LOGIN },
  signup: { title: 'Sign Up', url: ROUTES.SIGNUP },
};

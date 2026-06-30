export const ROUTES = {
  HOME: '/',
  HABITS: '/habits',
  TRACKING: '/tracking',
  ABOUT: '/about',
  PROFILE: '/profile/:userId?',
  FRIENDS: '/friends',
  REQUESTS: '/requests',
  GROUPS: '/groups',
  GROUP_DETAIL: '/groups/:id',
  SIGNIN: '/signin',
  NOT_FOUND: '*',
} as const;

export const TEAM_MEMBERS = [
  'Parth Chaturvedi',
  'Shashwat Kumar',
  'Anubhav Bhatnagar',
  'Maurya Bhatt',
  'Sankar Sivaraman',
  'Dr. Deb Bharadwaj',
] as const;

export type MemberName = typeof TEAM_MEMBERS[number];

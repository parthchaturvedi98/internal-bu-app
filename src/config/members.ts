export const TEAM_MEMBERS = [
  'Add your team member names here',
] as const;

export type MemberName = typeof TEAM_MEMBERS[number];

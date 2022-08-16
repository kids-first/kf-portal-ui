export const hasUserRole = (user: any) =>
  Array.isArray(user.roles) && !!user.roles[0];

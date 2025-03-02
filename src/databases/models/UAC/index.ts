// src/databases/models/UAC/index.ts

export * from './User';
export * from './UserLevel';

export interface UACModels {
  users: User;
  user_levels: UserLevel;
}

// Helper functions (optional but useful)
export const getUserFullName = (user: User): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.username;
};

export type UserFormData = Omit<
  User,
  'user_id' | 'password_hash' | 'date_created' | 'last_login'
>;

export interface UserWithRelations extends User {
  user_levels?: UserLevel;
  reports_to_user?: User;
}

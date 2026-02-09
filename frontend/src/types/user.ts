export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    isApproved?: boolean; // For vendors
}

export interface AuthState {
    user: User | null;
    token: string | null;
}

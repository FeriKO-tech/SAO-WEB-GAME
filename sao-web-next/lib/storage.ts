import { User } from '../models/user';

export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

export const clearCurrentUser = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
    }
};
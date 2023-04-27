import { createContext } from 'react';
import { User } from 'firebase/auth';

export const AuthContext = createContext(null as User | null);

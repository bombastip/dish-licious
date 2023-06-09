import { createContext } from 'react';
import { User } from '../interfaces';
const AuthContext = createContext({ user: null as User | null, userLoading: true as boolean });
export default AuthContext;

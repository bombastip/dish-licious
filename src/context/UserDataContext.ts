import { createContext } from 'react';
import { UserData } from '../interfaces';
const UserDataContext = createContext({ userData: null as UserData | null, userDataLoading: true as boolean });
export default UserDataContext;

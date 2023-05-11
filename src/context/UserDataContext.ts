import { Dispatch, SetStateAction, createContext } from 'react';
import { UserData } from '../interfaces';
const UserDataContext = createContext({
    userData: null as UserData | null,
    userDataLoading: true as boolean,
    setReloadUserData: null as unknown as Dispatch<SetStateAction<boolean>>,
});
export default UserDataContext;

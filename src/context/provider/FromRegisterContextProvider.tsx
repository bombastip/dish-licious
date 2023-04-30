import { useState, FC, ReactNode } from 'react'
import { fromRegisterContext } from '..';

interface FromRegisterProviderProps {
    children: ReactNode;
}

const FromRegisterProvider: FC<FromRegisterProviderProps> = ({ children }) => {
    const [fromRegister, setFromRegister] = useState<boolean>(false);

    
    return <fromRegisterContext.Provider value={{fromRegister, setFromRegister}}>{children}</fromRegisterContext.Provider>;
};

export default FromRegisterProvider;
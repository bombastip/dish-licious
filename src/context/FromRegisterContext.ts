import { createContext } from 'react';
import { fromRegisterContextType } from '../interfaces/interfaces';
const fromRegisterContext = createContext<fromRegisterContextType | null>(null);
export default fromRegisterContext;

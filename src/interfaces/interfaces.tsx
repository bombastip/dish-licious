type color = 'primary' | 'error' | 'default' | 'secondary' | 'success' | 'warning' | undefined;
export interface InputColorMessage {
    text: string;
    color: color;
}

export type ErrorMessasge = string | null;

export type fromRegisterContextType = {
    fromRegister: boolean;
    setFromRegister: (value: boolean) => void;
};

export type UserCompleteData = {
    id: string;
    username: string;
    photoURL: string;
};

export type UserData = {
    username: string;
    photoURL: string;
};

export type PostList = [id: string];

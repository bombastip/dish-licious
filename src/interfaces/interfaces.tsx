type color = 'primary' | 'error' | 'default' | 'secondary' | 'success' | 'warning' | undefined;
export interface InputColorMessage {
    text: string;
    color: color;
}
export interface UserData {
    email: string;
    username: string;
    photoURL: string;
}

export type ErrorMessasge = string | null;

export type fromRegisterContextType = {
    fromRegister: boolean;
    setFromRegister: (value: boolean) => void;
};

export interface PostType {
    description: string;
    likes: string[];
    photoURL: string;
    timeCost: number;
    timeUnit: string;
    title: string;
    userID: string;
}

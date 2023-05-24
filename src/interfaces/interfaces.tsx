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

export interface Ingredient {
    name: string;
    quantity: number;
    measureUnit: string;
}

export interface PostType {
    description: string;
    likes: string[];
    ingredients: Ingredient[];
    photoURL: string;
    timeCost: number;
    timeUnit: string;
    title: string;
    userID: string;
    id: string;
    comments: { uid: string; comment: string }[];
}

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

// group interfaces
export type GroupType = {
    name: string;
    description: string;
    photo: string;
    members: string[];
    admin: string;
    feed: string[];
    id: string;
};

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

export interface groupNotif {
    userID: string;
    groupID: string;
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
    profile: boolean;
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
export interface GroupType {
    admin: string;
    description: string;
    feed: [string];
    id: string;
    members: [string];
    name: string;
    photo: string;
}

export interface GroupCardInfo {
    id: string;
    members: [string];
    name: string;
    photo: string;
}

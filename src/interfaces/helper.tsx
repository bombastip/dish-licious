type color = 'primary' | 'error' | 'default' | 'secondary' | 'success' | 'warning' | undefined;
export interface InputColorMessage {
    text: string;
    color: color;
}
export type userdata = {
    email: string;
    username: string;
    photoURL: string;
};

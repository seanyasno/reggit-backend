import IProfile from './profile';

export default interface IUser {
    id: string;
    username: string;
    password: string;
    profile: IProfile | null;
}
// import { Profile } from "../profiles/profile.model";

export class User {
    constructor(
        public id: string,
        public name: string,
        public doc: string,
        public email: string,
        // public profiles: Profile[],
        public password: string,
        public token: string,
        public firstAccess: boolean,
        public pinCode: string,
        public accessCode: string
    ) { }
}
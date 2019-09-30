export default class UserService {
    public static async getCurrentUserName(): Promise<string> {
        // TODO: marmer 30.09.2019 implement me!
        // Current User - get https://jira.server/rest/auth/latest/session
        // {
        //   "self": "https://jira.server/rest/api/latest/user?username=username",
        //   "name": "username",
        //   "loginInfo": {
        //     "failedLoginCount": 397,
        //     "loginCount": 18260,
        //     "lastFailedLoginTime": "2019-09-27T20:07:35.232+0200",
        //     "previousLoginTime": "2019-09-27T20:14:22.157+0200"
        //   }
        // }
        throw new Error("not implemented yet");
    }
}

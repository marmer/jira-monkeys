import WindowService from "./WindowService";

export default class IssueSiteInfos {
    public static getCurrentIssueKey(): string {
        const windowLocationPathname = WindowService.getWindowLocationPathname();

        return !windowLocationPathname.startsWith("/browse/") ?
            "" :
            windowLocationPathname
                .replace("/browse/", "")
                .replace(/\/.*/, "");
    }

    public static getWorklogUrlForIssueKey(issueKey: string) {
        return WindowService.getWindowLocationOrigin() + "/rest/api/2/issue/" + issueKey + "/worklog";
    }

    public static getIssueUrlForIssueKey(issueKey: string): string {
        return WindowService.getWindowLocationOrigin() + "/rest/api/2/issue/" + issueKey;
    }

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

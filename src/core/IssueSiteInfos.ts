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
}

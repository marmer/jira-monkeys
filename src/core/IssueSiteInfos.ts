export default class IssueSiteInfos {
    public static getCurrentIssueKey(): string {
        return window.location.pathname.replace("/browse/", "")
    }
}
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
}
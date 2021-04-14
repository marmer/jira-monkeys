import WindowService from "./WindowService";
import {Worklog} from "./WorklogService";

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
    return IssueSiteInfos.getWorklogUrlForIssueId(issueKey);
  }

  public static getWorklogUrlForIssueId(issueKey: string) {
    return WindowService.getWindowLocationOrigin() + "/jira/rest/api/2/issue/" + issueKey + "/worklog";
  }

  public static getWorklogModifyUrlByWorklog(worklog: Worklog) {
    return this.getWorklogUrlForIssueId(worklog.issueId) + "/" + worklog.id;
  }

  public static getIssueUrlForIssueKey(issueKey: string): string {
    return WindowService.getWindowLocationOrigin() + "/jira/rest/api/2/issue/" + issueKey;
  }

  public static getCurrentUserUrl(): string {
    return WindowService.getWindowLocationOrigin() + "/jira/rest/auth/latest/session";
  }
}

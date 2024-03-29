import IssueSiteInfos from "./IssueSiteInfos";
import WindowService from "./WindowService";
import {Worklog} from "./WorklogService";

describe("IssueSiteInfos", () => {
  const worklogBase: Worklog = {
    issueId: "42",
    author: {
      name: "real.me",
      displayName: "Me",
    },
    timeSpentInMinutes: 1337,
    started: "2000-01-01T00:00:00.000+0000",
    id: "43",
    comment: "did something",
  };

  describe("getCurrentIssueKey()", () => {
    it("should extract an existing issue key", () => {
      WindowService.getWindowLocationPathname = jest.fn().mockReturnValue("/browse/MyIssueKey-1234");

      expect(IssueSiteInfos.getCurrentIssueKey()).toBe("MyIssueKey-1234");
    });
    it("should extract an existing issue key at closing paths", () => {
      WindowService.getWindowLocationPathname = jest.fn().mockReturnValue("/browse/MyIssueKey-1234/");

      expect(IssueSiteInfos.getCurrentIssueKey()).toBe("MyIssueKey-1234");
    });

    it("should return an empty string if there is no issue key", () => {
      WindowService.getWindowLocationPathname = jest.fn().mockReturnValue("/browse/");

      expect(IssueSiteInfos.getCurrentIssueKey()).toBe("");
    });

    it("should should return an empty string if the path is no issue key path", () => {
      WindowService.getWindowLocationPathname = jest.fn().mockReturnValue("/foo/");

      expect(IssueSiteInfos.getCurrentIssueKey()).toBe("");
    });

    it("should be able to extract the issue key from sub paths", () => {
      WindowService.getWindowLocationPathname = jest.fn().mockReturnValue("/browse/ISSUE-4321/somethingelse");

      expect(IssueSiteInfos.getCurrentIssueKey()).toBe("ISSUE-4321");
    });
  });

  describe("getWorklogUrlForIssueKey()", () => {
    it("should serve the current worklog URL for an issue key", async () => {
      WindowService.getWindowLocationOrigin = jest.fn().mockReturnValue("http://some.domain");

      expect(IssueSiteInfos.getWorklogUrlForIssueKey("issue-key")).toEqual("http://some.domain/jira/rest/api/2/issue/issue-key/worklog");
    });
  });

  describe("getWorklogUrlForIssueId()", () => {
    it("should serve the current worklog URL for an issue id", async () => {
      WindowService.getWindowLocationOrigin = jest.fn().mockReturnValue("http://some.domain");

      expect(IssueSiteInfos.getWorklogUrlForIssueKey("issueId")).toEqual("http://some.domain/jira/rest/api/2/issue/issueId/worklog");
    });
  });

  describe("getWorklogModifyUrlByWorklog()", () => {
    it("should serve the current worklog URL for an issue id", async () => {
      WindowService.getWindowLocationOrigin = jest.fn().mockReturnValue("http://some.domain");

      expect(IssueSiteInfos.getWorklogModifyUrlByWorklog({
        ...worklogBase,
        id: "456",
        issueId: "123",
      })).toEqual("http://some.domain/jira/rest/api/2/issue/123/worklog/456");
    });
  });

  describe("getIssueUrlForIssueKey()", () => {
    it("should serve an issue url by an issue key", async () => {
      WindowService.getWindowLocationOrigin = jest.fn().mockReturnValue("http://some.domain");

      expect(IssueSiteInfos.getIssueUrlForIssueKey("issue-key")).toEqual("http://some.domain/jira/rest/api/2/issue/issue-key");
    });
  });

  describe("getCurrentUserUrl()", () => {
    it("should serve the current user url", async () => {
      WindowService.getWindowLocationOrigin = jest.fn().mockReturnValue("https://jira.server");

      expect(IssueSiteInfos.getCurrentUserUrl()).toEqual("https://jira.server/jira/rest/auth/latest/session");

    });
  });
});

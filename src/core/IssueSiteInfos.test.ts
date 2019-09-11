import IssueSiteInfos from "./IssueSiteInfos";
import WindowService from "./WindowService";

describe("IssueSiteInfos", () => {
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
});
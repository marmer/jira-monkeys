import IssueSiteInfos from "./IssueSiteInfos";

describe("IssueSiteInfos", () => {
    describe("getCurrentIssueKey()", () => {
        let oldPathName: string;
        it.skip('should extract an existing issue key', () => {

            // TODO: marmer 11.09.2019 Time for another abstraction ;)

            window.location.pathname = "/browse/MyIssueKey-1234"
            expect(IssueSiteInfos.getCurrentIssueKey()).toBe("MyIssueKey-1234");

        });
        // TODO: marmer 10.09.2019 what about additional path parts? e.g. /browse/ISSUE-1234/blubba?
        // TODO: marmer 10.09.2019 nonexisting
    });
});
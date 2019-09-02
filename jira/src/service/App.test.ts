import WorklogSummarizer from "./WorklogSummarizer";
import App from "./App";

describe("a running app", () => {
    beforeEach(() => {
        WorklogSummarizer.prototype.register = jest.fn();
    });

    it('should register a worklog Summarizer', () => {
        App.run();
        expect(WorklogSummarizer.prototype.register).toHaveBeenCalled();
    });
});
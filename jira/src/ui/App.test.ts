import App from "./App";
import WorklogSummarizerRegistry from "./worklogSummeration/WorklogSummarizerRegistry";

describe("a running app", () => {
    beforeEach(() => {
        WorklogSummarizerRegistry.register = jest.fn();
    });

    it('should register a worklog Summarizer', () => {
        App.run();
        expect(WorklogSummarizerRegistry.register).toHaveBeenCalled();
    });
});
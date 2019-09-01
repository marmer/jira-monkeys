import WorklogSummarizer from "./WorklogSummarizer";
import App from "./App";

describe("a running app", () => {
    const summarizerRegisterMock = jest.fn();


    beforeEach(cb => {
        summarizerRegisterMock.mockClear();
        WorklogSummarizer.prototype.register = summarizerRegisterMock;
    });

    it('should register a worklog Summarizer', () => {
        App.run();
        expect(summarizerRegisterMock).toBeCalledTimes(1)
    });
});
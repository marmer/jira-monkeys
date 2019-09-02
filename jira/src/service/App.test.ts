import WorklogSummarizer from "./WorklogSummarizer";
import App from "./App";

describe("a running app", () => {
    let registerMock: jest.Mock<any, any>;

    beforeEach(cb => {
        registerMock = jest.fn().mockImplementationOnce(args => {
            // TODO: marmer 02.09.2019 Get out why this is not called oO
            console.log("why is this not called oO")
        });
        WorklogSummarizer.prototype.register = registerMock;
    });

    it('should register a worklog Summarizer', () => {
        // expect(registerMock).toBeCalled();
        App.run();
        // expect(registerMock).toBeCalled();
        expect(registerMock).toHaveBeenCalled();
    });
});
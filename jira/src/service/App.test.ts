import JiraSpike from "./JiraSpike";
import App from "./App";

describe("a running app", () => {
    beforeEach(() => {
        JiraSpike.prototype.register = jest.fn();
    });

    it('should register a worklog Summarizer', () => {
        App.run();
        expect(JiraSpike.prototype.register).toHaveBeenCalled();
    });
});
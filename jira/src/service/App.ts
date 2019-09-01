import WorklogSummarizer from "./WorklogSummarizer";

export default class App {
    static run() {
        const worklogSummarizer = new WorklogSummarizer();
        const register = worklogSummarizer.register;
        register();

    }
}
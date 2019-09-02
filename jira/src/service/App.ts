import WorklogSummarizer from "./WorklogSummarizer";

export default class App {
    static run() {
        new WorklogSummarizer().register();
    }
}
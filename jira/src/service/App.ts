import JiraSpike from "./JiraSpike";

export default class App {
    static run() {
        new JiraSpike().register();
    }
}
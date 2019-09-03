import JiraSpike from "./JiraSpike";

export default class App {
    static run() {
        new JiraSpike().register();

        // Element to register are created
        // Element have to be registered (so that they stay even if Jira tries to remove it as long as the parent element is not gone)
        // Element maintains state by itself!
    }
}
import moment = require("moment");
import React, {Component} from "react";
import JiraTimeService from "../core/JiraTimeService";
import EstimationView from "./EstimationView";

// TODO: marmer 27.09.2019 care!
// tslint:disable-next-line:no-empty-interface
interface WorklogShiftViewState {
}

export default class WorklogShiftView extends Component<{}, WorklogShiftViewState> {

    constructor(props: Readonly<{}>) {
        super(props);
    }

// Worklog structure (It exists already in an incomplete state)
//     export interface Worklog {
//     author: {
//         displayName: string,
//         name: string,
//     };
//     timeSpentInMinutes: number;
//     started: string ("2019-09-02T16:03:00.000+0200");
//     id: string;
//     comment: string;
// }

    public render(): React.ReactElement {
        return <>
            {/*// TODO: marmer 30.09.2019 This is just a mockup with inline styles*/}
            {/*// TODO: marmer 30.09.2019 Don't use the layout of a different View in this way*/}
            This is just a mockup remove this test when done!
            <div className="estimationShiftContainer">
                <table>
                    <thead>
                    <tr>
                        <th>Author</th>
                        <th>Comment</th>
                        <th>Start</th>
                        <th>Time Spent</th>
                        <th>Time to move</th>
                        <th>Move</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value="Sir Fakeisac Newton"/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value="Did the first step"/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value={moment("2019-09-02T16:03:00.000+0200").format("YYYY-MM-DD HH:mm:ss")}/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value={JiraTimeService.minutesToJiraFormat(225)}/></td>
                        <td><input style={{textAlign: "center"}} type="text" placeholder="5h 9m"
                                   value={JiraTimeService.minutesToJiraFormat(225)}/>
                        </td>
                        <td>
                            <button title="move">{">"}</button>
                        </td>
                    </tr>
                    <tr>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value="Sir Fakeisac Newton"/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value="Did the second step"/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value={moment("2019-09-02T17:03:00.000+0200").format("YYYY-MM-DD HH:mm:ss")}/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value={JiraTimeService.minutesToJiraFormat(135)}/></td>
                        <td><input style={{textAlign: "center"}} type="text" placeholder="5h 9m"
                                   value={JiraTimeService.minutesToJiraFormat(135)}/>
                        </td>
                        <td>
                            <button title="move">{">"}</button>
                        </td>
                    </tr>
                    <tr>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value="Sir Fakeisac Newton"/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value="Did nothing"/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value={moment("2019-09-02T17:05:00.000+0200").format("YYYY-MM-DD HH:mm:ss")}/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value={JiraTimeService.minutesToJiraFormat(240)}/></td>
                        <td><input style={{textAlign: "center"}} type="text" placeholder="5h 9m"
                                   value={JiraTimeService.minutesToJiraFormat(240)}/>
                        </td>
                        <td>
                            <button title="move">{">"}</button>
                        </td>
                    </tr>
                    <tr>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value="Sir Fakeisac Newton"/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value="Did the third step"/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value={moment("2019-09-09T17:05:00.000+0200").format("YYYY-MM-DD HH:mm:ss")}/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value={JiraTimeService.minutesToJiraFormat(1337)}/></td>
                        <td><input style={{textAlign: "center"}} type="text" placeholder="5h 9m"
                                   value={JiraTimeService.minutesToJiraFormat(1337)}/>
                        </td>
                        <td>
                            <button title="move">{">"}</button>
                        </td>
                    </tr>
                    <tr>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value="Sir Fakeisac Newton"/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value="Did the final step"/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value={moment("2019-11-12T17:05:00.000+0200").format("YYYY-MM-DD HH:mm:ss")}/></td>
                        <td><input style={{textAlign: "center"}} type="text" disabled={true}
                                   value={JiraTimeService.minutesToJiraFormat(123)}/></td>
                        <td><input style={{textAlign: "center"}} type="text" placeholder="5h 9m"
                                   value={JiraTimeService.minutesToJiraFormat(123)}/>
                        </td>
                        <td>
                            <button title="move">{">"}</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <label style={{textAlign: "center", alignSelf: "baseline"}}>
                    Target
                    {/*// TODO: marmer 30.09.2019 Don't use the layout of a different View in this way*/}
                    <EstimationView className="estimationShiftCardContainer" readonly={true}
                                    estimation={{
                                        issueKey: "issue-1234",
                                        issueSummary: "something todo",
                                        originalEstimate: "1w 2d",
                                        remainingEstimate: "4h 15m",
                                    }}/></label>
            </div>
        </>;
    }

}

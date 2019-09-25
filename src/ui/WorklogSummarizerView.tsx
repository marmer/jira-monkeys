import React, {Component} from "react";
import JiraTimeService from "../core/JiraTimeService";
import WorklogService, {Worklog} from "../core/WorklogService";
import "./WorklogSummarizerView.css";

interface WorklogSummarizerViewState {
    loadingState: "LOADING" | "DONE" | "ERROR";
    worklogs: Worklog[];
    sortColumn: "DISPLAY_NAME" | "TIME_SPENT";
}

export default class WorklogSummarizerView extends Component<{}, WorklogSummarizerViewState> {

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            loadingState: "LOADING",
            sortColumn: "DISPLAY_NAME",
            worklogs: [],
        };

    }

    public componentDidMount(): void {
        this.loadSummedBookings();
    }

    public render(): React.ReactElement {
        switch (this.state.loadingState) {
            case "ERROR":
                return <div>Error. Wanna try to reaload? ;)</div>;
            case "LOADING":
                return <div>Loading. Be patient!</div>;
            case "DONE":
                return <div>
                    <table>
                        <thead>
                        <tr>
                            <th onClick={() => this.sortWorklogsByDisplayName()}>display name
                                {this.state.sortColumn === "DISPLAY_NAME" && "^"}</th>
                            <th onClick={() => this.sortWorklogsByTime()}>time spent
                                {this.state.sortColumn === "TIME_SPENT" && "^"}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.worklogs.map(worklog =>
                            <tr key={worklog.author.displayName}>
                                <td className="displayNameColumn">{worklog.author.displayName}</td>
                                <td className="timeSpentColumn">{JiraTimeService.minutesToJiraFormat(worklog.timeSpentInMinutes)}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>;
        }

    }

    private sortWorklogsByTime() {
        this.setState({
            sortColumn: "TIME_SPENT",
            worklogs: this.getAsSortedByComparator(this.state.worklogs, (wl1: Worklog, wl2: Worklog) => wl1.timeSpentInMinutes - wl2.timeSpentInMinutes),
        });
    }

    private getAsSortedByComparator(worklogs: Worklog[], comparator: (wl1: Worklog, wl2: Worklog) => number) {
        const result = [...worklogs];
        result.sort(comparator);
        return result;
    }

    private sortWorklogsByDisplayName() {
        this.setState({
            sortColumn: "DISPLAY_NAME",
            worklogs: this.getAsSortedByComparator(this.state.worklogs, (wl1: Worklog, wl2: Worklog) => wl1.author.displayName < wl2.author.displayName ? -1 : 1),
        });
    }

    private loadSummedBookings() {
        this.setState({
            loadingState: "LOADING",
            worklogs: [],
        });
        WorklogService.getSummedWorklogsByUser()
            .then(worklogs => this.setState({
                loadingState: "DONE",
                worklogs,
            }))
            .catch(reason => {
                this.setState({loadingState: "ERROR"});
                return console.error(reason);
            });
    }
}

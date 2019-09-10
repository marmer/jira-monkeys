import React, {Component} from 'react';
import WorklogService, {Worklog} from "../core/WorklogService";
import JiraTimeService from "../core/JiraTimeService";
import "./WorklogSummarizerView.css";

interface WorklogSummarizerViewState {
    loadingState: "LOADING" | "DONE" | "ERROR",
    worklogs: Worklog[]
    sortColumn: "DISPLAY_NAME" | "TIME_SPENT"
}


export interface WorklogSummarizerViewProps {

}

export default class WorklogSummarizerView extends Component<WorklogSummarizerViewProps, WorklogSummarizerViewState> {

    constructor(props: Readonly<WorklogSummarizerViewProps>) {
        super(props);
        this.state = {
            loadingState: "LOADING",
            worklogs: [],
            sortColumn: "DISPLAY_NAME"
        };

    }

    componentDidMount(): void {
        this.loadSummedBookings();
    }

    render(): React.ReactElement {
        switch (this.state.loadingState) {
            case "ERROR":
                return <div>Error. Wanna try to reaload? ;)</div>;
            case "LOADING":
                return <div>Loading. Be patient!</div>;
            case "DONE":
                return <div>
                    <h1>
                        Worklogs summarized per User
                    </h1>
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
                </div>
        }

    }

    private sortWorklogsByTime() {
        this.setState({
            worklogs: this.getAsSortedByComparator(this.state.worklogs, (wl1: Worklog, wl2: Worklog) => wl1.timeSpentInMinutes - wl2.timeSpentInMinutes),
            sortColumn: "TIME_SPENT"
        })
    }

    private getAsSortedByComparator(worklogs: Worklog[], comparator: (wl1: Worklog, wl2: Worklog) => number) {
        const result = [...worklogs];
        result.sort(comparator);
        return result;
    }

    private sortWorklogsByDisplayName() {
        this.setState({
            worklogs: this.getAsSortedByComparator(this.state.worklogs, (wl1: Worklog, wl2: Worklog) => wl1.author.displayName < wl2.author.displayName ? -1 : 1),
            sortColumn: "DISPLAY_NAME"
        })
    }


    private loadSummedBookings() {
        this.setState({
            loadingState: "LOADING",
            worklogs: []
        });
        WorklogService.getSummedWorklogsByUser()
            .then(worklogs => this.setState({
                loadingState: "DONE",
                worklogs: worklogs
            }))
            .catch(reason => {
                this.setState({loadingState: "ERROR"});
                return console.error(reason);
            })
    }
}

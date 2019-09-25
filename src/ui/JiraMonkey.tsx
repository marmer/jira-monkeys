import React, {Component} from "react";
import BookingShiftView from "./BookingShiftView";
import EstimationFixView from "./EstimationFixView";
import EstimationShiftView from "./EstimationShiftView";
import "./JiraMonkey.css";
import WorklogSummarizerView from "./WorklogSummarizerView";

type ViewChoices = "WORKLOG_SUMMARIZER" | "ESTIMATION_SHIFT" | "BOOKING_SHIFT" | "ESTIMATION_FIX" | null | undefined;

interface JiraMonkeyState {
    toolsVisible: boolean;
    currentView?: ViewChoices;
}

export default class JiraMonkey extends Component<{}, JiraMonkeyState> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            toolsVisible: false,
        };
    }

    public componentDidMount(): void {
        this.setState({
            toolsVisible: (sessionStorage.getItem(JiraMonkey.name + ".toolsVisible") || "false") === "true",
            currentView: (sessionStorage.getItem(JiraMonkey.name + ".currentView")) as ViewChoices,
        });
    }

    public setState<K extends keyof JiraMonkeyState>(state: ((prevState: Readonly<JiraMonkeyState>, props: Readonly<{}>) => (Pick<JiraMonkeyState, K> | JiraMonkeyState | null)) | Pick<JiraMonkeyState, K> | JiraMonkeyState | null, callback?: () => void): void {
        super.setState(state, () => {
            sessionStorage.setItem(JiraMonkey.name + ".toolsVisible", "" + this.state.toolsVisible);
            sessionStorage.setItem(JiraMonkey.name + ".currentView", "" + this.state.currentView);
        });
    }

    public render(): React.ReactElement {
        return <div>
            <input id="JiraMonkeyToggle" type="checkbox"
                   checked={this.state.toolsVisible}
                   onChange={() => this.setState({toolsVisible: !this.state.toolsVisible})}
                   title="Jira Monkeys"/>
            {this.state.toolsVisible &&
            <header id="JiraMonkeyContainer">
                <div className="monkeyToggler">
                    <button onClick={() => this.setState({currentView: "WORKLOG_SUMMARIZER"})}>
                        Worklog-summarizer
                    </button>
                    <button onClick={() => this.setState({currentView: "ESTIMATION_SHIFT"})}>
                        Estimation-shifter
                    </button>
                    <button onClick={() => this.setState({currentView: "BOOKING_SHIFT"})}>
                        Booking-shifter
                    </button>
                    <button onClick={() => this.setState({currentView: "ESTIMATION_FIX"})}>
                        Estimation-fixer
                    </button>
                </div>
                <main>
                    {this.state.currentView === "WORKLOG_SUMMARIZER" &&
                    <WorklogSummarizerView/>}

                    {this.state.currentView === "ESTIMATION_SHIFT" &&
                    <EstimationShiftView/>}

                    {this.state.currentView === "BOOKING_SHIFT" &&
                    <BookingShiftView/>}

                    {this.state.currentView === "ESTIMATION_FIX" &&
                    <EstimationFixView/>}
                </main>
            </header>
            }
        </div>;
    }
}

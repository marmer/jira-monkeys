import React, {Component, ReactNode} from "react";
import EstimationShiftView from "./EstimationShiftView";
import "./JiraMonkey.css";
import WorklogSummarizerView from "./WorklogSummarizerView";

interface JiraMonkeyState {
    toolsVisible: boolean;
    currentView?: ReactNode;
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
            toolsVisible: (localStorage.getItem(JiraMonkey.name + ".toolsVisible") || "false") === "true",
        });
    }

    public setState<K extends keyof JiraMonkeyState>(state: ((prevState: Readonly<JiraMonkeyState>, props: Readonly<{}>) => (Pick<JiraMonkeyState, K> | JiraMonkeyState | null)) | Pick<JiraMonkeyState, K> | JiraMonkeyState | null, callback?: () => void): void {
        super.setState(state, () => {
            if (callback) {
                callback();
            }

            localStorage.setItem(JiraMonkey.name + ".toolsVisible", "" + this.state.toolsVisible);
        });
    }

    public render(): React.ReactElement {
        return <div>
            <input id="JiraMonkeyToggle" type="checkbox"
                   checked={this.state.toolsVisible}
                   onClick={() => this.setState({toolsVisible: !this.state.toolsVisible})}
                   title="Jira Monkeys"/>
            {this.state.toolsVisible &&
            <header id="JiraMonkeyContainer">
                <div className="monkeyToggler">
                    <button onClick={() => this.setCurrentView(<WorklogSummarizerView/>)}>
                        Worklog-summarizer
                    </button>
                    <button onClick={() => this.setCurrentView(<EstimationShiftView/>)}>
                        Estimation-shifter
                    </button>
                    <button onClick={() => this.setCurrentView(<div>nothing to see here yet
                        (Booking-shifter)</div>)}>Booking-shifter
                    </button>
                    <button onClick={() => this.setCurrentView(<div>nothing to see here yet
                        (Estimation-fixer)</div>)}>Estimation-fixer
                    </button>
                </div>
                <main>
                    {this.state.currentView}
                </main>
            </header>
            }
        </div>;
    }

    private setCurrentView(view: ReactNode) {
        this.setState({
            currentView: null,
        });
        this.setState({
            currentView: view,
        });
    }
}

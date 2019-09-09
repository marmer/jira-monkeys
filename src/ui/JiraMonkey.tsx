import React, {Component, ReactNode} from 'react';
import "./JiraMonkey.css"
import WorklogSummarizerView from "./WorklogSummarizerView";
import EstimationShiftView, {EstimationShiftViewProps} from "./EstimationShiftView";

interface JiraMonkeyState {
    toolsVisible: boolean
    currentView?: ReactNode
}

export interface JiraMonkeyProps {

}

export default class JiraMonkey extends Component<JiraMonkeyProps, JiraMonkeyState> {

    constructor(props: Readonly<JiraMonkeyProps>) {
        super(props);
        this.state = {
            toolsVisible: false
        }
    }

    componentDidMount(): void {
        this.setState({
            toolsVisible: (localStorage.getItem(JiraMonkey.name + ".toolsVisible") || "false") === "true",
        })
    }

    setState<K extends keyof JiraMonkeyState>(state: ((prevState: Readonly<JiraMonkeyState>, props: Readonly<EstimationShiftViewProps>) => (Pick<JiraMonkeyState, K> | JiraMonkeyState | null)) | Pick<JiraMonkeyState, K> | JiraMonkeyState | null, callback?: () => void): void {
        super.setState(state, () => {
            if (callback) callback();

            localStorage.setItem(JiraMonkey.name + ".toolsVisible", "" + this.state.toolsVisible)
        })
    }

    render(): React.ReactElement {
        return <div>
            <input id="JiraMonkeyToggle" type="checkbox"
                   checked={this.state.toolsVisible}
                   onClick={() => this.setState({toolsVisible: !this.state.toolsVisible})}
                   title="Jira Monkeys"/>
            {this.state.toolsVisible &&
            <div id="JiraMonkeyContainer">
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
                <div>
                    {this.state.currentView}
                </div>
            </div>
            }
        </div>
    }

    private setCurrentView(view: ReactNode) {
        this.setState({
            currentView: null
        });
        this.setState({
            currentView: view
        });
    }
}

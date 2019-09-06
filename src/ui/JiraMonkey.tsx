import React, {Component, ReactNode} from 'react';
import "./JiraMonkey.css"
import WorklogSummarizerView from "./WorklogSummarizerView";

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
            toolsVisible: false,
            currentView: <WorklogSummarizerView/>
        }
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
                    <button onClick={() => this.setCurrentView(<div>nothing to see here yet
                        (Booking-shifter)</div>)}>Booking-shifter
                    </button>
                    <button onClick={() => this.setCurrentView(<div>nothing to see here yet
                        (Estimation-shifter)</div>)}>Estimation-shifter
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


// TODO: marmer 05.09.2019 make the component refresh/reload if the "site changes" (the site content gets replaced by jira)


// #### update ticket estimations
// fetch("***/rest/api/2/issue/***", {
//     "method": "PUT",
//     "headers": {
//         "content-type": "application/json",
//         "accept": "application/json"
//     },
//     "body": {
//         "fields": {
//             "timetracking": {
//                 "originalEstimate": "2d",
//                 "remainingEstimate": "3h"
//             }
//         }
//     }
// })

// #### create a new worklog
// fetch("https://jira.schuetze.ag/rest/api/2/issue/****/worklog", {
//     "method": "POST",
//     "headers": {
//         "content-type": "application/json",
//         "accept": "application/json"
//     },
//     "body": {
//         "comment": "Somethign really new",
//         "timeSpent": "2d 1h 10m"
//     }
// })


// #### Update/delete worklog
// fetch("https://jira.schuetze.ag/rest/api/2/issue/****/worklog/*****", {
//     "method": "PUT",
//     "headers": {
//         "content-type": "application/json",
//         "accept": "application/json",
//     },
//     "body": {
//         "comment": "Möp with update",
//         "timeSpent": "2d"
//     }
// })
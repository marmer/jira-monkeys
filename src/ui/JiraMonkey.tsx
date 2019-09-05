import React, {useState} from 'react';
import WorklogSummarizerView from "./WorklogSummarizerView";
import "./JiraMonkey.css"
// TODO: marmer 05.09.2019 make the component refresh/reload if the "site changes" (the site content gets replaced by jira)
export default (): React.ReactElement => {
    const [state, setState] = useState({
        toolsVisible: false
    });

    return <div className="aui-header aui-dropdown2-trigger-group">
        <input id="JiraMonkeyToggle" type="checkbox"
               checked={state.toolsVisible}
               onClick={() => setState({toolsVisible: !state.toolsVisible})}
               title="Jira Monkeys"/>
        {state.toolsVisible && <div id="JiraMonkeyContainer"><WorklogSummarizerView/></div>}
    </div>
}

import React, {useState} from 'react';
import WorklogSummarizerView from "./WorklogSummarizerView";

// TODO: marmer 05.09.2019 make the component refres/reload if the "site changes" (the site content gets replaced by jira)


export default (): React.ReactElement => {
    const [state, setState] = useState({
        toolsVisible: false
    });

    return <div className="aui-header aui-dropdown2-trigger-group">
        <label>
            <input type="checkbox"
                   className="aui-button toggle-title"
                   checked={state.toolsVisible}
                   onClick={() => setState({toolsVisible: !state.toolsVisible})}
                   title="Jira Monkeys"
            />
            <span className="toggle-title">Jira-Monkeys</span>
        </label>
        {/*// TODO: marmer 05.09.2019 this should possibly be a more general container with the possible tools instead of the tools itself*/}
        {state.toolsVisible && <WorklogSummarizerView/>}
    </div>
}

import React, {useState} from 'react';
import WorklogSummarizerView from "./WorklogSummarizerView";

// TODO: marmer 05.09.2019 make the component refres/reload if the "site changes" (the site content gets replaced by jira)


export default (): React.ReactElement => {
    const [state, setState] = useState({
        toolsVisible: false
    });

    return <div>
        <input type="checkbox"
               checked={state.toolsVisible}
               onClick={() => setState({toolsVisible: !state.toolsVisible})}
               value="Jira-Monkeys"/>
        {/*// TODO: marmer 05.09.2019 this should possibly be a more general container with the possible tools instead of the tools itself*/}
        {state.toolsVisible && <WorklogSummarizerView/>}
    </div>
}

import React from 'react';
import WorklogSummarizerView from "./WorklogSummarizerView";

// TODO: marmer 05.09.2019 make the component refres/reload if the "site changes" (the site content gets replaced by jira)

export default (): React.ReactElement => {
    return <div>
        <WorklogSummarizerView/>
    </div>
}

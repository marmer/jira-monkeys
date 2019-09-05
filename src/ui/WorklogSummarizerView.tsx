import React, {Component} from 'react';

interface WorklogSummarizerViewState {

}

export interface WorklogSummarizerViewProps {

}

export default class WorklogSummarizerView extends Component<WorklogSummarizerViewProps, WorklogSummarizerViewState> {

    constructor(props: Readonly<WorklogSummarizerViewProps>) {
        super(props);
    }

    render(): React.ReactElement {
        return <div>
            Some Summarizing Content :D
        </div>;
    }

}

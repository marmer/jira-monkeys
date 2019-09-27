import React, {Component} from "react";

// TODO: marmer 27.09.2019 care!
// tslint:disable-next-line:no-empty-interface
interface WorklogShiftViewState {
}

export default class WorklogShiftView extends Component<{}, WorklogShiftViewState> {

    constructor(props: Readonly<{}>) {
        super(props);
    }

    public render(): React.ReactElement {
        return <div>
            <label>
                Current User {}
            </label>
        </div>;
    }

}

import React, {ReactNode} from 'react';

interface TabPannelState {

}

export interface TabPannelProps {
    children: {
        title: string,
        pane: ReactNode
    }[]
}

export default (props: TabPannelProps): React.ReactElement => <div>
    {props.children.map(child => <button key={child.title}>{child.title}</button>)}
    {props.children[0].pane}
    {props.children[1].pane}
</div>;

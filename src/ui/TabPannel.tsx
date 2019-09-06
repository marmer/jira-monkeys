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
    {props.children.map(child => <h2 key={child.title}>{child.title}</h2>)}
    {props.children[0].pane}
    {props.children[1].pane}
</div>;

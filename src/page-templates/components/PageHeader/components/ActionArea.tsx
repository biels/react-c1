import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, IconName, Intent } from '@blueprintjs/core';

const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    grid-auto-flow: column;
    grid-gap: 4px;
`;

export type Action = {
    name: string
    iconName?: IconName
    callback: (e) => any
    text?: any
    tooltip?: string
    intent?: Intent,
    enabled?: boolean
    shown?: boolean
    confirmation?: boolean
    confirmationText?: any

};

export interface ActionAreaProps {
    actions: Action[]
}

class ActionArea extends Component<ActionAreaProps> {
    render() {
        const actionItems = this.props.actions
            .filter(a => a.shown)
            .map((action, i) => { // Improve key
                return <Button key={i} onClick={action.callback}>{action.name}</Button>;
            });
        return <Container>
            {actionItems}
        </Container>;
    }
}

export default ActionArea;

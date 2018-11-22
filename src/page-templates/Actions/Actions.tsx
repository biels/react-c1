import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { Action } from '../components/PageHeader/components/ActionArea';
import ActionButton from './ActionButton';

const Container = styled.div<{vertical: boolean}>`
    display: grid;
    align-items: center;
    grid-gap: 4px;
    grid-auto-flow: ${({vertical}) => vertical ? 'row' : 'column'};
`

export interface ActionsProps {
    actions: Action[]
    noText?: boolean
    minimal?: boolean
    hideDisabled?: boolean
    vertical?: boolean
}

class Actions extends Component<ActionsProps> {
    render() {
        return <Container vertical={this.props.vertical}>
            {this.props.actions.filter(a => {
                if(!_.get(a, 'shown', true)) return false;
                return a.enabled || !this.props.hideDisabled;
            }).map(a => {
                return <ActionButton key={a.name} action={a} noText={this.props.noText} minimal={this.props.minimal}/>
            })}
        </Container>
    }
}

export default Actions;

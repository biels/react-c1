import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { Callout } from '@blueprintjs/core';

const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    padding: 16px;
    border: 2px solid blue;
    background: aqua;
`;

export interface WIPComponentProps {

}

class WIPComponent extends Component<WIPComponentProps> {
    render() {
        return <Callout title={'Funcionalidad en desarrollo'} intent={'primary'}>
            Esta funcionalidad se encuentra en proceso de ser implementada
        </Callout>
    }
}

export default WIPComponent;

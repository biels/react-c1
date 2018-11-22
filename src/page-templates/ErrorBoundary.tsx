import React, { Component } from 'react';
import styled from 'styled-components';
import { NonIdealState } from '@blueprintjs/core';
import * as _ from 'lodash';

const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    padding: 16px;
    border: 2px solid blue;
    background: aqua;
`;

export interface ErrorBoundaryProps {

}

class ErrorBoundary extends Component<ErrorBoundaryProps> {

    state = { hasError: false, error: null, info: null };

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true, error, info });
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            let text = 'No se puede mostrar la página';
            let description = <pre>
                {_.get(this.state.info, 'componentStack', '[No Stack]').substring(0, 300)}
            </pre>;
            return <NonIdealState icon={'error'} title={JSON.stringify(this.state.error)} description={description}/>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;

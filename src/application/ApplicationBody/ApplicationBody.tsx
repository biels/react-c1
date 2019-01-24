import React, { Component } from 'react';
import styled from 'styled-components';
import {NavigationPageRenderer} from 'react-navigation-plane';


const Container = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    background-color: aqua;
    min-height: 0px;
`
interface ApplicationBodyProps {
    maxHiddenFrames?
    maxHiddenStacks?
}

class ApplicationBody extends Component<ApplicationBodyProps> {
    render() {
        return (
            <React.Fragment>
                {/* Or login screen if not logged in */}
                {/* Or error page*/}
                <NavigationPageRenderer maxHiddenFrames={this.props.maxHiddenFrames || 4} maxHiddenStacks={this.props.maxHiddenStacks || 6}/>
            </React.Fragment>
        );
    }
}

export default ApplicationBody;

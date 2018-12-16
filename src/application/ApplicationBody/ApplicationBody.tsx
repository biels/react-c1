import React, { Component } from 'react';
import styled from 'styled-components';
import {NavigationPageRenderer} from 'react-navigation-plane';


const Container = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    background-color: aqua;
    min-height: 0px;
`


class ApplicationBody extends Component {
    render() {
        return (
            <React.Fragment>
                {/* Or login screen if not logged in */}
                {/* Or error page*/}
                <NavigationPageRenderer maxHiddenFrames={0} maxHiddenStacks={0}/>
            </React.Fragment>
        );
    }
}

export default ApplicationBody;

import React, {Component} from 'react';
import styled from "styled-components";
import _ from "lodash";
import AppBarButton from "./components/AppBarButton";

const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    grid-auto-flow: column;
`

export interface AppMenuBarProps {

}

class AppMenuBar extends Component<AppMenuBarProps> {
    render() {
        return <Container>
            <AppBarButton icon={"cog"} onClick={() => {}}/>
            <AppBarButton  icon={"notifications"} onClick={() => {}}/>
            <AppBarButton  icon={"user"} onClick={() => {}}/>
        </Container>
    }
}

export default AppMenuBar;
import React, {Component} from 'react';
import styled from 'styled-components';
import AppIcon from "./AppIcon";
import {Icon} from "@blueprintjs/core";
import AppMenuBar from "./AppMenuBar";


const Container = styled.div`
    background-color: #34424e;
    height: auto;
    display: grid;
    align-items: center;
    grid-gap: 8px;
    padding: 8px 16px;
    grid-template-columns: auto 1fr auto;
`


class ApplicationBar extends Component {
    render() {
        return (
            <Container className="bp3-dark">
                <AppIcon/>
                <div className="bp3-input-group">
                    <span className="bp3-icon bp3-icon-search"/>
                    <input className="bp3-input" placeholder="Busca cualquier cosa" dir="auto"/>
                </div>
                <AppMenuBar/>
            </Container>
        );
    }
}

export default ApplicationBar;
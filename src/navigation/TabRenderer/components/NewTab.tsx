import React, {Component} from 'react';
import styled from "styled-components";
import _ from "lodash";
import {Icon} from "@blueprintjs/core";

const DefaultNewTabContainer = styled.div`
    margin-left: 6px;
    color: cadetblue;
    padding: 2px;
    height: 80%;
`

export interface NewTabProps {
    onClick: () => void
}

class NewTab extends Component<NewTabProps> {
    render() {
        return <DefaultNewTabContainer onClick={this.props.onClick}>
            <Icon icon={'plus'}/>
        </DefaultNewTabContainer>
    }
}

export default NewTab;

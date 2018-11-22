import React, {Component, MouseEventHandler} from 'react';
import styled from "styled-components";
import {Icon, IconName} from "@blueprintjs/core";

const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    padding: 8px;
    color: #98aab7;
    &:hover{
      color:  #b9cede;
    }
`

interface AppBarButtonProps {
    onClick: MouseEventHandler,
    icon: IconName
}

class AppBarButton extends Component<AppBarButtonProps> {
    render() {
        return <Container onClick={this.props.onClick}>
            <Icon icon={this.props.icon} />
        </Container>
    }
}

export default AppBarButton;
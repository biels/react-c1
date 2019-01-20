import React, {Component} from 'react';
import styled from "styled-components";
import _ from "lodash";
import {ContextMenuTarget, Icon, IconName, Menu, MenuItem} from "@blueprintjs/core";
import {NavigationConsumer} from 'react-navigation-plane';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    color: #2699fb;
    border-radius: 25px;
    :hover {
      background-color: gold;
    }
`

export interface BackArrowProps {

}


class BackArrow extends Component<BackArrowProps> {
    public renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        // TODO Implement back menu in this way or another
        return (
            <Menu>
                <NavigationConsumer>
                    {({back, stack}) => {
                        return stack.frames.map((frame, i) => {
                            return <MenuItem
                                key={i}
                                text={_.capitalize(frame.pageName.toString())}
                                icon={"document"}
                                onClick={() => back(i)}
                            />
                        })
                    }}
                </NavigationConsumer>
            </Menu>
        );
    }
    render() {
        return <div>
            <NavigationConsumer>
                {({back, stack}) => {
                    // TODO Change icon depending on backwards navigation mode
                    // Modes: one of: [back, return, close, none]
                    return <Container onClick={() => back()}>
                        <Icon icon={"arrow-left"}/>
                    </Container>
                }}
            </NavigationConsumer>
        </div>
    }
}

export default BackArrow;

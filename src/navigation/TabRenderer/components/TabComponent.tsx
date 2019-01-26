import React, {Component, SyntheticEvent} from 'react';
import styled, {css} from "styled-components";
import _ from "lodash";
import {ContextMenu, Icon, Menu, MenuItem} from "@blueprintjs/core";
import {SortableElement} from "react-sortable-hoc";

const Container = styled.div<{ selected: boolean }>`
    cursor: default;
    padding: 2px;
    height: 24px;
    min-width: 150px;
    max-width: 200px;
    user-select: none;
    border-radius: 5px 5px 0px 0px;
    ${({selected}) => selected ? css`
        background-color: white;
    ` : css`
        background-color: #EBF1F5;
        :hover{
        background-color: #ebf1f5;
        }
    `}
`

const LabelContainer = styled.span`
    font-size: 12px;
    text-overflow: ellipsis;
    text-wrap: none;
    white-space: nowrap; 
    overflow: hidden;
`
const ContentContainer = styled.div`
    display: flex;
    margin: 2px;
    justify-content: space-between;
    align-items: center;
`
const IconContainer = styled.span`
    margin-left: 4px;
    color: #8a9ba8;
    :hover{
        color: #738694;
    }
`

export interface TabComponentProps {
    title: string
    icon?: string
    active: boolean
    closeable: boolean
    size: number
    onClose?: () => void
    onCloseClick?: () => void
    onClick: () => void
    onNewTabClick: () => void
    onDuplicateTabClick: () => void
}

class TabComponent extends Component<TabComponentProps> {
    handleCloseClick = (e: SyntheticEvent) => {
        e.stopPropagation()
        this.props.onCloseClick()
    }
    handleMouseDown = (e: SyntheticEvent) => {
        let nativeEvent: MouseEvent = e.nativeEvent as MouseEvent;
        if(nativeEvent.button == 1){
            e.preventDefault()
            e.stopPropagation()
            this.props.onCloseClick()
        }else if (nativeEvent.button == 2) {
            const menu = <Menu>
                <MenuItem icon={'plus'} onClick={() => this.props.onNewTabClick()} text="Nova pestanya" />
                <MenuItem icon={'duplicate'} onClick={() => this.props.onDuplicateTabClick()} text="Duplica" />
                <MenuItem icon={'refresh'} onClick={() => null} text="Refresca" />
                <MenuItem icon={'cross'} onClick={() => this.props.onCloseClick()} text="Tanca" />
            </Menu>

            // mouse position is available on event
            ContextMenu.show(menu, { left: nativeEvent.clientX, top: nativeEvent.clientY }, () => {
                // menu was closed; callback optional
            });
        }else{
            this.props.onClick()
        }
    }
    render() {

        return <Container selected={this.props.active} onMouseDown={this.handleMouseDown}>
            <ContentContainer>
                <LabelContainer>{this.props.title}</LabelContainer>
                <IconContainer onClick={this.handleCloseClick}><Icon icon={'cross'}/></IconContainer>
            </ContentContainer>
        </Container>
    }
}

export default TabComponent;

import React, {Component} from 'react';
import styled from "styled-components";
import _ from "lodash";
import {Button, Intent, Popover, PopoverInteractionKind, Tooltip} from "@blueprintjs/core";
import {Action} from "../components/PageHeader/components/ActionArea";

const Container = styled.div`
    display: grid;
    align-items: center;
    grid-gap: 4px;
`
const PopoverContentContainer = styled.div`
    display: grid;
    padding: 8px;
    grid-gap: 8px;
    grid-template-rows: auto auto;
    > div {
      display: flex;
      justify-content: space-between;
    }
    
`

export interface ActionButtonProps {
    action: Action
    noText: boolean
    minimal: boolean
    intent?: Intent
}

class ActionButton extends Component<ActionButtonProps> {
    static defaultProps: Partial<ActionButtonProps> = {
        action: {callback: () => null, iconName: 'badge', name: 'placeholder', text: 'Placeholder'},
        noText: true,
    }
    state = {
        isPopoverOpen: false
    }
    handlePopoverConfirmClick = (e) => {
        this.props.action.callback(e)
        this.setState({isPopoverOpen: false})
    }
    handlePopoverCancelClick = () => {
        this.setState({isPopoverOpen: false})
    }
    handleInteraction = (nextOpenState) => {
        return this.setState({isPopoverOpen: nextOpenState})
    }

    render() {
        const action = this.props.action;
        const intent = this.props.intent || action.intent || Intent.NONE;
        const enabled = action.enabled == null ? true : action.enabled
        const renderPopover = (button) => {
            return <Popover
                content={<PopoverContentContainer>
                    <span>{this.props.action.confirmationText}</span>
                    <div><Button intent={Intent.DANGER} onClick={this.handlePopoverConfirmClick}>Si</Button>
                        <Button onClick={this.handlePopoverCancelClick}>No</Button></div>
                </PopoverContentContainer>}
                interactionKind={PopoverInteractionKind.CLICK}
                isOpen={this.state.isPopoverOpen}
                onInteraction={(state) => this.handleInteraction(state)}
            >
                {button}
            </Popover>
        }
        const button = <Tooltip content={enabled ? (this.props.noText ? action.text : action.tooltip): null} intent={intent}><Button
            icon={action.iconName}
            text={this.props.noText ? null : action.text}
            onClick={!action.confirmation ? action.callback : () => this.setState({isPopoverOpen: true})}
            minimal={this.props.minimal}
            intent={intent}
            disabled={!(enabled)}
        /></Tooltip>
        return this.props.action.confirmation ?
            renderPopover(button)
            :
            button


    }
}

export default ActionButton;

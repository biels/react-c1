import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Tooltip, Position, IconName, Intent} from '@blueprintjs/core';
import styled from 'styled-components'

const InnerIconContainer = styled.div`
    color: #738592;
`

export interface MIconTooltipProps {
    display: string
    icon?: IconName
    intent?: Intent
}

export default class MIconTooltip extends React.PureComponent<MIconTooltipProps> {
    static defaultProps: Partial<MIconTooltipProps> = {
        icon: "add",
        intent: "none",
    }

    render() {
        return (
            <Tooltip
                content={this.props.display}
                position={Position.RIGHT}>
                <InnerIconContainer>
                    <Icon
                        icon={this.props.icon}
                        iconSize={Icon.SIZE_LARGE}
                        intent={this.props.intent}
                    />
                </InnerIconContainer>
            </Tooltip>
        );
    }
}


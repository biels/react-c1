import React, {Component} from 'react';
import styled, {css} from "styled-components";
import _ from "lodash";
import {Icon, IconName, Intent, Popover} from "@blueprintjs/core";
import UserCardPopover from "./components/UserCardPopover";
import MIconTooltip from "./components/MIconTooltip";
import './Sarah-User.png'
const Container = styled.div`
    height: 100%;
    background-color: #34424e;
    display: flex;
    flex-direction: column;
`
const TabContainer = styled.div`
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100%;
    > div {
      height: min-content;
    }
`
const IconContainer = styled.div<{ selected: boolean }>`
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #738592;
    ${({selected}) => selected ? css`
      background-color: #252f36;
    ` : null}
`

const LogoContainer = styled.div`
    background-color: #34424e;
    grid-area: logo;
    color: white;
    font-stretch: ultra-condensed;
    text-align: center;
    font-size: xx-large;
`


const ProfilePicture = styled.div`
    background-image: url('./Sarah-User.png');
    background-size: contain;
    //background-color: rgba(255, 223, 202, 0.082);
    //border: 3px dashed rgb(23, 69, 221);
    border-radius: 20px;
    border: 2px solid #137cbd;
    height: 38px;
    width: 38px;
    box-shadow: 0px 0px 1px 1px #2a3339;
    &:hover{
      box-shadow: 0px 0px 3px 3px #2a3339;
    }
`

export interface SidebarButton {
    iconName: IconName
    tooltip: string
    onClick: () => void
}

export interface SidebarProps {
    buttons: SidebarButton[]
    bottomCount: number
    selectedIndex: number | null
    renderLogo?: Function
}

class Sidebar extends Component<SidebarProps> {
    static defaultProps: Partial<SidebarProps> = {
        renderLogo: () => <LogoContainer>
            <span>I</span>
        </LogoContainer>
    }
    render() {
        const iconTags = this.props.buttons.map((buttonInfo, i) => {
            let iconComponent;
            if (buttonInfo.iconName === 'user') {
                let userPreview = <Icon icon={buttonInfo.iconName} iconSize={Icon.SIZE_LARGE}/>;
                if (true) userPreview = <ProfilePicture/>
                iconComponent = () => <Popover
                    target={userPreview}
                    content={<UserCardPopover/>}
                />
            }

            if (iconComponent == null) iconComponent = () => <MIconTooltip display={buttonInfo.tooltip}
                                                                           icon={buttonInfo.iconName}
                                                                           intent={i === this.props.selectedIndex ? Intent.PRIMARY : Intent.NONE}/>;
            return (
                <IconContainer key={i} selected={i === this.props.selectedIndex} onClick={buttonInfo.onClick}>
                    {iconComponent()}
                    {/*<Icon className={css.innerIcon} iconName={buttonInfo.icon} iconSize={Icon.SIZE_LARGE}*/}
                    {/*intent={i === index ? Intent.PRIMARY : Intent.NONE}/>*/}

                </IconContainer>
            );
        });
        const topIcons = iconTags.slice(0, iconTags.length - this.props.bottomCount);
        const bottomIcons = iconTags.slice(iconTags.length - this.props.bottomCount);
        return <Container>
            {this.props.renderLogo()}
            <TabContainer>
                <div>{topIcons}</div>
                <div/>
                <div>{bottomIcons}</div>
            </TabContainer>
        </Container>
    }
}

export default Sidebar;

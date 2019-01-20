import React, {Component, ReactNode} from 'react';
import styled from "styled-components";
import _ from "lodash";
import {IconName, Icon} from "@blueprintjs/core";

const OuterContainer = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    grid-gap: 8px;
`
const Title = styled.div`
    font-size: 20px;
    line-height: 110%;
`
const Subtitle = styled.div`
    size: 14px;
    line-height: 110%;
`
const TitleLine = styled.div`
    
`
const SubtitleLine = styled.div`
    
`
const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-rows: auto auto;
`
const IconContainer = styled.span`
    display: grid;
    justify-content: center;
    align-items: center;
    color: #738694;
    
`

export interface TitleAreaProps {
    icon: IconName
    title: ReactNode,
    subtitle: ReactNode
}

class TitleArea extends Component<TitleAreaProps> {
    render() {
        return <OuterContainer>
            <IconContainer>
                <Icon iconSize={32} icon={this.props.icon}/>
            </IconContainer>
            <Container>
                <TitleLine>
                    <Title>{this.props.title}</Title>
                </TitleLine>
                <SubtitleLine>
                    <Subtitle>{this.props.subtitle}</Subtitle>
                </SubtitleLine>
            </Container>
        </OuterContainer>
    }
}

export default TitleArea;

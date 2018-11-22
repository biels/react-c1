import React, {Component, ReactNode} from 'react';
import styled from "styled-components";
import _ from "lodash";


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

export interface TitleAreaProps {
    title: ReactNode,
    subtitle: ReactNode
}

class TitleArea extends Component<TitleAreaProps> {
    render() {
        return <Container>
            <TitleLine>
                <Title>{this.props.title}</Title>
            </TitleLine>
            <SubtitleLine>
                <Subtitle>{this.props.subtitle}</Subtitle>
            </SubtitleLine>
        </Container>
    }
}

export default TitleArea;
import React, {Component} from 'react';
import styled from "styled-components";
import _ from "lodash";
import BackArrow from "./components/BackArrow";
import TitleArea, {TitleAreaProps} from "./components/TitleArea";
import Placeholder from "../../Placeholder";
import ActionArea, {ActionAreaProps} from "./components/ActionArea";

const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    padding: 2px 8px;
    grid-gap: 8px;
    height: 50px;
    background-color: white;
    grid-template-columns: auto auto 1fr auto;
`

export interface PageHeaderProps {
    title: TitleAreaProps['title']
    subtitle: TitleAreaProps['subtitle']
    actions: ActionAreaProps['actions']
    renderCustomHeaderArea: () => JSX.Element
}

class PageHeader extends Component<PageHeaderProps> {
    render() {
        return <Container>
            <BackArrow/>
            <TitleArea title={this.props.title} subtitle={this.props.subtitle}/>
            {this.props.renderCustomHeaderArea() || <Placeholder name={'CustomHeaderArea'}/>}
            <ActionArea actions={this.props.actions}/>
        </Container>
    }
}

export default PageHeader;

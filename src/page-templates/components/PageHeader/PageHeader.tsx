import React, {Component} from 'react';
import styled from "styled-components";
import _ from "lodash";
import BackArrow from "./components/BackArrow";
import TitleArea, {TitleAreaProps} from "./components/TitleArea";
import Placeholder from "../../Placeholder";
import ActionArea, {ActionAreaProps} from "./components/ActionArea";
import DefaultCustomHeaderArea, {DefaultCustomHeaderAreaProps} from "./components/DefaultCustomHeaderArea";
import {EntityRenderProps} from 'react-entity-plane';

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
    icon?: TitleAreaProps['icon']
    entity?: EntityRenderProps
    renderCustomHeaderArea?: (entity?: EntityRenderProps) => JSX.Element
    renderTagsArea?: DefaultCustomHeaderAreaProps['renderTagsArea']
    renderAttributesArea?: DefaultCustomHeaderAreaProps['renderAttributesArea']
    renderActionsArea?: DefaultCustomHeaderAreaProps['renderActionsArea']
    attributes?: DefaultCustomHeaderAreaProps['attributes']
}

class PageHeader extends Component<PageHeaderProps> {
    render() {
        const entity = this.props.entity;
        let defaultCustomHeaderArea = <DefaultCustomHeaderArea
            entity={entity}
            renderTagsArea={this.props.renderTagsArea}
            renderAttributesArea={this.props.renderAttributesArea}
            renderActionsArea={this.props.renderActionsArea}
            attributes={this.props.attributes}
        />;
        return <Container>
            <BackArrow/>
            <TitleArea icon={this.props.icon || _.get(entity, 'entityInfo.display.icon')}
                       title={this.props.title} subtitle={this.props.subtitle}/>
            {this.props.renderCustomHeaderArea(this.props.entity) || defaultCustomHeaderArea}
            <ActionArea actions={this.props.actions}/>
        </Container>
    }
}

export default PageHeader;

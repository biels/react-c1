import React, {Component} from 'react';
import _ from "lodash";
import styled from "styled-components";
import {EntityRenderProps} from 'react-entity-plane';
import AttributeDisplay, {AttributesProp} from '../../AttributeDisplay';

const Container = styled.div`
    display: grid;
    grid-auto-columns: auto;
    grid-auto-flow: column;
    grid-template-columns: auto 1fr;
    grid-gap: 8px;
    align-items: center;
`
const DefaultMultiContainer = styled.div`
    display: grid;
    grid-auto-columns: auto;
    grid-auto-flow: column;
    grid-gap: 8px;
    align-items: center;
`
export interface DefaultCustomHeaderAreaProps {
    entity?: EntityRenderProps
    renderTagsArea?: (entity: EntityRenderProps) => JSX.Element
    renderAttributesArea?: (entity: EntityRenderProps) => JSX.Element
    renderActionsArea?: (entity: EntityRenderProps) => JSX.Element
    attributes?: AttributesProp | ((entity: EntityRenderProps) => AttributesProp)
}
// [Tags] [Attributes] [Actions]
class DefaultCustomHeaderArea extends Component<DefaultCustomHeaderAreaProps> {
    static defaultProps: Partial<DefaultCustomHeaderAreaProps> = {

    }
    render() {
        const entity = this.props.entity;
        let attributes = _.isFunction(this.props.attributes) ? this.props.attributes(entity) : this.props.attributes
        return <Container>
            <DefaultMultiContainer>{this.props.renderTagsArea && this.props.renderTagsArea(entity)}</DefaultMultiContainer>
            <div>{this.props.renderAttributesArea && this.props.renderAttributesArea(entity) ||
            <AttributeDisplay attributes={attributes}/>}</div>
            {this.props.renderActionsArea && this.props.renderActionsArea(entity)}
        </Container>
    }
}

export default DefaultCustomHeaderArea;

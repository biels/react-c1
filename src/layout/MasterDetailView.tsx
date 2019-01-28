import React, { Component, ComponentType } from 'react';
import styled from 'styled-components';
import {Entity, EntityRenderProps } from 'react-entity-plane';
import { EntityInfoKey } from 'react-entity-plane';
import {NonIdealState} from "@blueprintjs/core";
import {EntityProps} from 'react-entity-plane/src/Entity';

const DefaultContainer = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: minmax(50%, 2fr) 1fr;
    grid-gap: 8px;
    padding: 8px;
`;

export interface MasterDetailViewRenderProps {
    entity: EntityRenderProps
}

export interface MasterDetailViewProps {
    name?: EntityInfoKey
    relation?: string
    query?: string
    masterQuery?: string
    additionalRefetchQueries?: EntityProps['additionalRefetchQueries']
    fetchPolicy?: EntityProps['fetchPolicy']
    detailFetchPolicy?: EntityProps['fetchPolicy']
    renderMasterView: (renderProps: MasterDetailViewRenderProps) => any
    renderDetailView: (renderProps: MasterDetailViewRenderProps) => any
    wrapperComponent?: ComponentType<any>
    allowMulti: boolean
    params?
}

class MasterDetailView extends Component<MasterDetailViewProps> {
    static defaultProps: Partial<MasterDetailViewProps> = {
        wrapperComponent: DefaultContainer,
        allowMulti: false
    };

    render() {
        const Container = this.props.wrapperComponent;
        return <Entity name={this.props.name} relation={this.props.relation} additionalRefetchQueries={this.props.additionalRefetchQueries} fetchPolicy={this.props.fetchPolicy} query={this.props.masterQuery || this.props.query} params={this.props.params}>
            {(masterEntity) => {
                // TODO Add master distinction here
                return <Container>
                    {this.props.renderMasterView({ entity: masterEntity })}
                    <Entity fetchPolicy={this.props.detailFetchPolicy || this.props.fetchPolicy} query={this.props.query} params={this.props.params} detail>
                        {(detailEntity) => {
                            let display = detailEntity.entityInfo.display;
                            if(detailEntity.selectedItem == null){
                                return <NonIdealState title={`Selecciona ${display.gender ? 'un' : 'una'} ${display.singular.toLowerCase()}`} icon={(display.icon || "person") as any}/>
                            }
                            let count = detailEntity.selectedIds.length;
                            if(!this.props.allowMulti && count > 1){
                                return <NonIdealState title={`${count} ${display.plural.toLowerCase()}`} icon={(display.icon || "person") as any}/>
                            }
                            return this.props.renderDetailView ? this.props.renderDetailView({ entity: detailEntity }) : null;
                        }}
                    </Entity>
                </Container>;
            }}
        </Entity>;
    }
}

export default MasterDetailView;

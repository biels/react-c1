import React, {Component, ComponentType} from 'react';
import styled from "styled-components";
import _ from "lodash";
import Entity from "react-entity-plane/lib/Entity";
import {EntityInfoKey} from "react-entity-plane/lib/types/entities";
import {Action} from "../page-templates/components/PageHeader/components/ActionArea";

const Container = styled.div`
    display: grid;
    padding: 8px;
    grid-gap: 8px;
`

export interface EntityListProps {
    name?: EntityInfoKey;
    relation?: string;
    containerComponent?: ComponentType<any>;
    itemComponent: ComponentType<{index: number, actions?: Action[]}>;
    itemComponentProps?: Object;
    actions?: Action[]
}

class EntityList extends Component<EntityListProps> {
    static defaultProps: Partial<EntityListProps> = {
        containerComponent: Container
    }
    render() {
        const C = this.props.containerComponent;
        return <C>
            <Entity name={this.props.name} relation={this.props.relation}>
                {({items}) => {
                    const ItemComponent = this.props.itemComponent;
                    return items.map((it, i) =>
                        <ItemComponent key={i} index={i} actions={this.props.actions} {...this.props.itemComponentProps} />
                    )
                }}

            </Entity>
        </C>
    }
}

export default EntityList;

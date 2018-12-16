import React, { Component, ComponentType, Ref } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { EntityRenderProps, Entity } from 'react-entity-plane';
import { EntityInfoKey } from 'react-entity-plane';
import { Action } from '../page-templates/components/PageHeader/components/ActionArea';
import { Button, InputGroup } from '@blueprintjs/core';
import { AgGridReact } from 'ag-grid-react';
import Actions from '../page-templates/Actions/Actions';
import { toaster } from '../application/toaster';
import { GridApi } from 'ag-grid-community';

// const OldContainer = styled.div`
//     height: 100%;
//     display: grid;
//     grid-template-columns: 2fr 1fr;
//     grid-template-areas: "ClientsGrid ClientPreview";
//     grid-gap: 8px;
//     padding: 8px;
// `
const Container = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr;
    grid-gap: 8px;
    grid-template-areas: 
    "GridHeader ."
    "GridContainer GridToolbar"
`;
const GridContainerArea = styled.div`
    grid-area: GridContainer;
    display: grid;
    height: 30vh;
    overflow: hidden;
`;
const GridHeaderArea = styled.div`
    grid-area: GridHeader;
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 1fr auto;
    
`;

const GridToolbarArea = styled.div`
    grid-area: GridToolbar;
   
`;
const GridToolbarContainer = styled.div`
    display: grid;
    justify-content: start;
    align-items: start;
    grid-gap: 4px;
`;
const ActiveFilterContainer = styled.div`
    display: grid;
    align-items: center;
    div > label {
      margin-bottom: 0px;
    }
`;

interface CustomFilterBarRenderProps {
    onChangeFilter: (newFilter: Object) => void
    filter: any
}

export interface EntityGridProps {
    name?: EntityInfoKey;
    relation?: string;
    containerComponent?: ComponentType<any>;
    renderHeader?: ({ searchFieldElement, customFilterElement, removeFiltersElement }) => any;
    actions?: Partial<Action[]>;
    renderCustomFilterBar?: (props: CustomFilterBarRenderProps) => any
    columnDefs: any
    frameworkComponents: any
    //External filter
    neutralExternalFilter: object // If matches then there is no filter
    defaultExternalFilter: object // Default external filter
    doesExternalFilterPass: (filter: Object, node: any) => boolean
    externalFilter: object
    onExternalFilterChange: (newExternalFilter) => void
}

class MiniEntityGrid extends Component<EntityGridProps> {
    static defaultProps: Partial<EntityGridProps> = {
        containerComponent: Container,
        renderHeader: ({ searchFieldElement, customFilterElement, removeFiltersElement }) => {
            return <GridHeaderArea>
                {searchFieldElement}
                {customFilterElement}
                {removeFiltersElement}
            </GridHeaderArea>;
        },
    };
    // state = {
    //   customFilter: this.props.neutralFilter,
    //   gridKey: 0,
    // };
    gridRef: Ref<AgGridReact> = React.createRef();
    gridApi: GridApi = null;
    // increaseGridKey = () => {
    //     this.setState({gridKey: this.state.gridKey + 1})
    //     console.log('this.state.gridKey', this.state.gridKey);
    // };
    isExternalFilterPresent = (entity: EntityRenderProps) => () => {
        // TODO Optimize external filter present
        return true; //!_.isEqual(this.props.externalFilter, this.props.neutralExternalFilter)
    };
    doesExternalFilterPass = (entity: EntityRenderProps) => (node) => {
        const externalFilter = this.props.externalFilter || this.props.defaultExternalFilter;
        return this.props.doesExternalFilterPass(externalFilter, node);
    };
    handleGridReady = ({ api }) => {
        this.gridApi = api;
    };
    handleCellValueChange = (cellValue) => {
        // console.warn('WWWW handleCellValueChange', cellValue);
    };
    handleFilterChange = (entity: EntityRenderProps) => (e) => {
        entity.setEntityState({ filter: e.target.value });
        this.gridApi.setQuickFilter(e.target.value);
    };
    handleExternalFilterChange = (entity: EntityRenderProps) => (filter) => {
        // EXTERNAL FILTER
        // this.props.onExternalFilterChange();
        // entity.setEntityState({ customFilter: _.merge({}, entity.entityState.customFilter, filter) }, true);
        this.props.onExternalFilterChange(filter);
        this.gridApi.onFilterChanged();
    };
    handleClearFilters = (entity: EntityRenderProps) => () => {
        this.gridApi.setFilterModel({});
        // entity.setEntityState({ filter: '', customFilter: this.props.neutralFilter });
        this.props.onExternalFilterChange(this.props.defaultExternalFilter);
        this.gridApi.onFilterChanged();
        this.gridApi.setQuickFilter(null);
    };

    // shouldComponentUpdate(newProps, newState) {
    //     //if(_.isEqual(this.props, newProps)) return false;
    //     return true;
    // }

    render() {
        const C = this.props.containerComponent; // TODO Pick styles from ClientsGrid
        return <C>
            <Entity name={this.props.name} relation={this.props.relation}>
                {(entity: EntityRenderProps) => {
                    let disabled = false;//!(this.gridApi && this.gridApi.isAnyFilterPresent());
                    const getEntityState = () => entity.entityState;
                    if (entity.entityState.filter === undefined || entity.entityState.customFilter === undefined) {
                        entity.setEntityState({ filter: '' }, false);
                    }
                    const defaultActions = [
                        {
                            name: 'referesh',
                            iconName: 'refresh',
                            text: 'Refrescar',
                            callback: () => entity.refetch,
                        },
                        {
                            name: 'open',
                            iconName: 'edit',
                            text: 'Detalles / Editar',
                            callback: () => entity.openInOwnPage(entity.selectedItem.id as number, {}, true),
                        },
                        {
                            name: 'nuevo',
                            iconName: 'document',
                            text: 'Nuevo elemento',
                            callback: () => toaster.show({
                                message: 'Acción Nuevo aún no disponible',
                                icon: 'info-sign',
                            }),
                        },
                        {
                            name: 'remove',
                            iconName: 'trash',
                            text: 'Eliminar',
                            callback: entity.removeSelected,
                            confirmation: true,
                            confirmationText: `¿Está seguro que desea eliminar este elemento?`,
                        },
                    ];
                    // TODO Merge action one by one, using templates by name, setting all non specified properties to the template ones.
                    const actions = _.merge([], this.props.actions);
                    // console.log('entityState @ R', entity.entityState.customFilter);
                    return <Container>
                        {this.props.renderHeader({
                            searchFieldElement: <InputGroup leftIcon={'search'}
                                                            onChange={this.handleFilterChange(entity)}
                                                            placeholder={'Buscar en todo...'}
                                                            value={entity.entityState.filter || ''}/>,
                            customFilterElement: this.props.renderCustomFilterBar({
                                onChangeFilter: this.handleExternalFilterChange(entity),
                                filter: this.props.externalFilter || this.props.defaultExternalFilter,
                            }),
                            removeFiltersElement: <Button disabled={disabled} icon={'filter-remove'}
                                                          onClick={this.handleClearFilters(entity)}>Quitar filtros</Button>
                        })}
                        <GridHeaderArea>





                        </GridHeaderArea>
                        <GridContainerArea className={'ag-theme-balham'}>
                            <AgGridReact
                                key={0}
                                ref={this.gridRef}
                                onGridReady={this.handleGridReady}
                                rowData={entity.items}
                                onRowClicked={(e) => {
                                    entity.selectId(e.data.id);
                                }}
                                onRowDoubleClicked={(e) => entity.openInOwnPage(e.data.id, {}, true)}
                                enableColResize
                                enableSorting
                                enableFilter
                                floatingFilter
                                frameworkComponents={this.props.frameworkComponents as any}
                                columnDefs={this.props.columnDefs}
                                isExternalFilterPresent={this.isExternalFilterPresent(entity)}
                                doesExternalFilterPass={this.doesExternalFilterPass(entity)}
                            />
                        </GridContainerArea>
                        <GridToolbarArea>
                            <GridToolbarContainer>
                                <Actions actions={actions}
                                         noText={true}
                                         vertical={true}
                                />
                            </GridToolbarContainer>
                        </GridToolbarArea>
                    </Container>;
                }}
            </Entity>
        </C>;
    }
}

export default MiniEntityGrid;

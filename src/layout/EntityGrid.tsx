import React, { Component, ComponentType, Ref } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Entity, { EntityProps, EntityRenderProps } from 'react-entity-plane/lib/Entity';
import { EntityInfoKey } from 'react-entity-plane/lib/types/entities';
import { Action } from '../page-templates/components/PageHeader/components/ActionArea';
import { Button, InputGroup } from '@blueprintjs/core';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import Actions from '../page-templates/Actions/Actions';
import { toaster } from '../application/toaster';
import { AgGridEvent, GridApi, RowClickedEvent, RowNode, RowSelectedEvent } from 'ag-grid-community';
import ErrorBoundary from '../page-templates/ErrorBoundary';

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
    "GridFooter ."
`;

const GridContainerArea = styled.div<{ height: number | string, baseNegativeOffset: number }>`
    grid-area: GridContainer;
    display: grid;
    height: calc(${props => `${props.height} - ${props.baseNegativeOffset}px`});
    overflow: hidden;
`;
const GridHeaderArea = styled.div`
    grid-area: GridHeader;
    display: grid;
    grid-gap: 8px;
    grid-template-columns: minmax(50px, 1fr) auto auto;
    align-items: center;
`;

const GridToolbarArea = styled.div`
    grid-area: GridToolbar;
   
`;
const GridFooterArea = styled.div`
    grid-area: GridFooter;
`;

const GridToolbarContainer = styled.div`
    display: grid;
    justify-content: start;
    align-items: start;
    grid-gap: 20px;
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

export interface EntityGridRenderProps {
    entity: EntityRenderProps
    gridApi: GridApi
}

export interface EntityGridProps {
    name?: EntityInfoKey;
    relation?: string;
    query?: string;
    containerComponent?: ComponentType<any>;
    renderHeader?: ({ searchFieldElement, customFilterElement, removeFiltersElement }) => any;
    renderFooter?: (props: EntityGridRenderProps) => any;
    actions?: Partial<Action>[] | ((entity: EntityRenderProps) => Partial<Action>[]);
    renderCustomFilterBar?: (props: CustomFilterBarRenderProps) => any
    columnDefs: ((entity: EntityRenderProps) => Object) | Object
    gridProps?: Partial<AgGridReactProps>
    frameworkComponents: any
    //External filter
    neutralExternalFilter: object // If matches then there is no filter
    defaultExternalFilter: object // Default external filter
    doesExternalFilterPass: (filter: Object, node: any) => boolean
    externalFilter: object
    onExternalFilterChange: (newExternalFilter) => void
    height?: number | string
    baseNegativeOffset?: number
    poll?: boolean
    fetchPolicy: EntityProps['fetchPolicy']
    gridKey: any
    onRowDoubleClicked: (data: { id: number | string }, e: AgGridEvent) => any;
    selectAllFilter: (it) => boolean
    selectAllText: string
}
let gridId = 0;
class EntityGrid extends Component<EntityGridProps> {
    static defaultProps: Partial<EntityGridProps> = {
        containerComponent: Container,
        renderHeader: ({ searchFieldElement, customFilterElement, removeFiltersElement }) => {
            return <GridHeaderArea>
                {searchFieldElement}
                {customFilterElement}
                {removeFiltersElement}
            </GridHeaderArea>;
        },
        height: '75vh',
        baseNegativeOffset: 70,
    };
    // state = {
    //   customFilter: this.props.neutralFilter,
    //   gridKey: 0,
    // };
    gridRef: Ref<AgGridReact> = React.createRef();
    gridApi: GridApi = null;
    gridId: number = 0;
    componentDidMount(): void {
        this.gridId = gridId++;
    }

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
    handleGridReady = (entity: EntityRenderProps) => ({ api }) => {
        this.gridApi = api;
    };
    handleCellValueChange = (cellValue) => {
        // console.warn('WWWW handleCellValueChange', cellValue);
    };
    handleFilterChange = (entity: EntityRenderProps) => (e) => {
        entity.setEntityState({ filter: e.target.value });
        this.gridApi.setQuickFilter(e.target.value);
        // setTimeout();
    };
    handleExternalFilterChange = (entity: EntityRenderProps) => (filter) => {
        // EXTERNAL FILTER
        // this.props.onExternalFilterChange();
        // entity.setEntityState({ customFilter: _.merge({}, entity.entityState.customFilter, filter) }, true);
        this.props.onExternalFilterChange(filter);
        //this.gridApi.onFilterChanged()
        // if (this.gridApi && this.gridApi.isQuickFilterPresent())
        //Needed
        setTimeout(() => {
            this.gridApi.setQuickFilter('');
            return this.gridApi.onFilterChanged();
        });

    };
    handleClearFilters = (entity: EntityRenderProps) => () => {
        this.gridApi.setFilterModel({});
        // entity.setEntityState({ filter: '', customFilter: this.props.neutralFilter });
        this.props.onExternalFilterChange(this.props.defaultExternalFilter);
        setTimeout(() => this.gridApi.onFilterChanged());
        this.gridApi.setQuickFilter(null);
    };

    // shouldComponentUpdate(newProps, newState) {
    //     // if() return false;
    //     return _.isEqual(this.props, newProps);
    // }

    render() {
        const C = this.props.containerComponent; // TODO Pick styles from ClientsGrid
        return <C>
            <ErrorBoundary>
                <Entity name={this.props.name} relation={this.props.relation}
                        fetchPolicy={this.props.fetchPolicy}
                        query={this.props.query} poll={this.props.poll}>
                    {(entity: EntityRenderProps) => {
                        const footer = this.props.renderFooter && this.props.renderFooter({
                            gridApi: this.gridApi,
                            entity,
                        });
                        let disabled = false;//!(this.gridApi && this.gridApi.isAnyFilterPresent());
                        const handleGridReadyWithEntity = this.handleGridReady(entity);
                        const getEntityState = () => entity.entityState;
                        if (entity.entityState.filter === undefined || entity.entityState.customFilter === undefined) {
                            entity.setEntityState({ filter: '' }, false);
                        }
                        const defaultActions = [
                            {
                                name: 'referesh',
                                iconName: 'refresh',
                                text: 'Refrescar',
                                callback: () => entity.refetch(),
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
                        let providedActions = this.props.actions;
                        if (_.isFunction(providedActions)) providedActions = providedActions(entity);
                        const actions = providedActions.map(pa => Object.assign({}, defaultActions.find(da => da.name === pa.name), pa));


                        const selectionActions: Action[] = [
                            {
                                name: 'selectAll',
                                iconName: 'select',
                                text: this.props.selectAllText || 'Seleccionar todos',
                                callback: () =>{
                                    if(!_.isArray(entity.items)) return;
                                    entity.selectIds(entity.items.filter(this.props.selectAllFilter || (() => true)).map(it => it.id as number), null, true)
                                },
                            },
                            {
                                name: 'unselectAll',
                                iconName: 'small-cross',
                                text: 'Limpiar selección',
                                callback: () => entity.selectIds([], null, true),
                            },
                        ];
                        let columnDefs = this.props.columnDefs;
                        if(_.isFunction(columnDefs)) columnDefs = columnDefs(entity);
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
                                                              onClick={this.handleClearFilters(entity)}>Quitar
                                    filtros</Button>,
                            })}
                            <GridHeaderArea>


                            </GridHeaderArea>
                            <GridContainerArea height={this.props.height}
                                               baseNegativeOffset={this.props.baseNegativeOffset}
                                               className={'ag-theme-balham'}>
                                {this.getAgGridReact(handleGridReadyWithEntity, entity, columnDefs)}
                            </GridContainerArea>
                            <GridToolbarArea>
                                <GridToolbarContainer>
                                    <Actions actions={actions}
                                             noText={true}
                                             vertical={true}
                                    />
                                    <Actions
                                        actions={columnDefs[0].checkboxSelection === true ? selectionActions : []}
                                        noText={true}
                                        vertical={true}
                                    />
                                    {/*<div>ID: {this.gridId}</div>
                                    <div>Idx: {entity.selectedIndex}</div>
                                    <div>Idxs: {entity.selectedIndexes.toString()}</div>
                                    <div>Ids: {entity.selectedIds.toString()}</div>
                                    <div>Id: {entity.selectedId}</div>*/}
                                </GridToolbarContainer>
                            </GridToolbarArea>
                            <GridFooterArea>
                                {footer}
                            </GridFooterArea>
                        </Container>;
                    }}
                </Entity></ErrorBoundary>
        </C>;
    }

    private getAgGridReact(handleGridReadyWithEntity, entity: EntityRenderProps, columnDefs) {
        // console.log(`Grid ${this.gridId} items`, entity.items.length);
        return <EntityGridInternalWrapper
            key={0}
            gridKey={this.props.gridKey}
            gridRef={this.gridRef}
            onGridReady={handleGridReadyWithEntity}
            rowData={entity.items}
            rowMultiSelectWithClick={false}
            getRowNodeId={(data) => data.id.toString()}
            onRowDoubleClicked={(e) => {
                if (this.props.onRowDoubleClicked) {
                    this.props.onRowDoubleClicked(e.data, e);
                } else {
                    entity.openInOwnPage(e.data.id, {}, true);
                }
            }}
            enableColResize
            enableSorting
            enableFilter
            floatingFilter
            rowSelection={'multiple'}
            frameworkComponents={this.props.frameworkComponents as any}
            columnDefs={columnDefs}
            isExternalFilterPresent={this.isExternalFilterPresent(entity)}
            doesExternalFilterPass={this.doesExternalFilterPass(entity)}
            {...this.props.gridProps}
            entity={entity}
            externalFilter={this.props.externalFilter}
        />;
    }
}


interface EntityGridInternalWrapperProps {
    entity: EntityRenderProps
    gridRef
    rowData
    onGridReady
    gridKey: any

    [other: string]: any
}

class EntityGridInternalWrapper extends Component<EntityGridInternalWrapperProps> {
    gridApi: GridApi = null;
    selectedNodes: RowNode[] = [];
    updates = 0;
    blocked = false; // TODO Remove
    interval = null;
    modifiedLocally = false;
    touched: number[] = [];
    componentDidMount(): void {
        this.interval = setInterval(this.updateBothWays, 45);
    }
    componentWillUnmount(): void {
        clearInterval(this.interval);
    }

    isBlocked = () => {
        return this.blocked;
    };
    block = () => {
        this.blocked = true;
    };
    unblock = (callback: Function) => {
        setTimeout(() => {
            this.blocked = false;
            callback();
        }, 110);
    };
    handleGridReady = (params) => {
        this.gridApi = params.api;
        this.props.onGridReady(params);
    };

    shouldComponentUpdate(newProps: EntityGridInternalWrapperProps, newState) {
        // if() return false;
        // if(!_.isEqual(this.props.rowData, newProps.rowData)){
        //     return true
        // }
        //if (this.gridApi && this.gridApi.getSelectedNodes().length > 1) return false;
        if (this.isBlocked()) return false;
        // Below 3 are useful, but disabled since we're not filtering
        // if (!_.isEqual(this.props.externalFilter, newProps.externalFilter)) return true;
        // if (!_.isEqual(this.props.rowData.length, newProps.rowData.length)) return true;
        // if (!_.isEqual(this.props.rowData, newProps.rowData)) return true;
        return true; // TODO Consider filtering all unnecessary updates
    }

    componentWillUpdate() {
        if (this.gridApi == null) return;
        this.selectedNodes = this.gridApi.getSelectedNodes();
    }

    componentDidUpdate() {
        // this.updates = this.updates + 1;
        // console.log(`Grid wrapper updated ${this.updates} times`);
        if (this.isBlocked()) return;
        this.updateIn();
    }
    // TODO Timer based approach w/ modified flag?
    updateBothWays = () => {
        let touchedSnapshot = _.clone(this.touched)
        const modifiedLocally = this.touched.length > 0;
        if(modifiedLocally){
            this.updateOut(null);
        }else{
            this.updateIn()
        }
        this.touched.length = 0;
    }
    updateIn = () => {
        // Set selected nodes based on entity
        // console.log(`Updating IN`);
        if (this.isBlocked()) {
            console.log(`Avoiding update while blocked...`);
            return;
        }

        if (this.gridApi == null) return;
        const currentlySelectedIds = this.gridApi.getSelectedNodes().map(node => node.data.id);
        let newSelectedIds = this.props.entity.selectedIds;

        const removed = _.difference(currentlySelectedIds, newSelectedIds);
        const added = _.difference(newSelectedIds, currentlySelectedIds);

        const findNodeById = id => this.gridApi.getRenderedNodes().find(node => node.data.id == id);

        const setSelected = (node: RowNode, value) => node.setSelected(value, false, true);

        //this.updatingFromOutside = true;
        //setTimeout(() => this.updatingFromOutside = false, 1000);
        // removed.map(findNodeById).filter(n => n != null).forEach(node => setSelected(node, false));
        // added.map(findNodeById).filter(n => n != null).forEach(node => setSelected(node, true));
        //console.log(`Selecting rows...`, removed, added);
        if (removed.length > 0) this.toggleRowsExternally(removed, false);
        if (added.length > 0) {
            this.toggleRowsExternally(added, true);
            if (newSelectedIds.length === 1) this.gridApi.ensureNodeVisible((n) => n.data.id === newSelectedIds[0], null);
        }

        //this.updatingFromOutside = false;

        // console.log(`Removed: ${removed.toString()}, added: ${added.toString()} (current ${currentlySelectedIds}, new ${newSelectedIds.toString()})`);

        // console.log(`this.props.entity.selectedIds: `, this.props.entity.selectedIds);
    };

    updateOut = (singleId) => {
        // console.log(`Updating OUT`);
        // Set entity selection based on nodes
        if (this.isBlocked()) {
            console.log(`Avoiding updating entity while blocked...`);
            return;
        }
        if (this.gridApi == null) return;
        const ids = this.gridApi.getSelectedNodes().map((node, index) => node.data.id);
        this.props.entity.selectIds(ids, singleId, true);
        // setTimeout(() => {
        //     //this.block();
        //     //this.unblock(() => null);
        // });
    };
    toggleRowsExternally = (ids, select: boolean) => {
        this.blocked = true;
        const renderedNodes = this.gridApi.getRenderedNodes();
        let rowData = this.props.rowData;
        //console.log(`renderedNodes`, renderedNodes, rowData);
        this.gridApi.forEachNode(node => {
            if (ids.includes(node.data.id)) {
                // console.log(`Selecting `, '*' + node.data.draftInvoiceNumber, 'id: ' + node.data.id, node.data);
                node.setSelected(select, false, true);
            }
        });
        this.blocked = false;
    };

    render() {
        return (
            <AgGridReact
                ref={this.props.gridRef}
                key={this.props.gridKey}
                onRowClicked={(e: RowClickedEvent) => {
                    // if (this.gridApi.getSelectedNodes().length > 1){
                    //     return;
                    // }
                    //e.node.setSelected(true, false, true);
                    //this.props.entity.selectId(e.data.id);

                }}
                onRowSelected={(e: RowSelectedEvent) => {
                    this.modifiedLocally = true;
                    this.touched.push(e.data.id);
                    if (this.isBlocked()) return;
                   // console.log(`onRowSelected`, e);
                   // this.updateOut(e.data.id);
                    // // if(this.gridApi.getSelectedNodes().length > 1) return;
                    // let ids = this.gridApi.getSelectedNodes().map(node => _.get(node.data, 'id'));
                    // this.props.entity.selectIds(ids, true);
                }}
                {...this.props}
                onGridReady={this.handleGridReady}
            />
        );
    }
}


export default EntityGrid;

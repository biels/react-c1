import React, { Component } from 'react';
import styled from 'styled-components';
import Entity, { EntityRenderProps } from 'react-entity-plane/lib/Entity';
import { EntityInfoKey } from 'react-entity-plane/lib/types/entities';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import MasterDetailView, { MasterDetailViewProps } from './MasterDetailView';

const OuterContainer = styled.div`
    > div {
      width: 900px;
    }
`;
const Container = styled.div`
    display: grid;
    
`;
const PickerDetailContainer = styled.div`
    display: grid;
    grid-template-rows: 1fr auto;
`;
const PickerDetailFooterContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
`;

export interface EntityPickerProps {
    name?: EntityInfoKey;
    relation?: string;
    onPick: (picked: object) => void
    value: object
    isOpen: boolean
    onClose: () => void
    renderMasterView: MasterDetailViewProps['renderMasterView']
    renderDetailView: MasterDetailViewProps['renderDetailView']
}

class EntityPicker extends Component<EntityPickerProps> {
    componentDidUpdate(): void {
    }

    render() {
        return <Entity name={this.props.name} relation={this.props.relation}>
            {(entity: EntityRenderProps) => {
                const handleClose = () => {
                    this.props.onClose();
                };
                const handleSelect = (item) => {
                    this.props.onPick(item);
                };
                return <OuterContainer>
                    <Dialog
                        className={'full-width'}
                        lazy={false}
                        usePortal={true}
                        title={`Seleccione un elemento`}
                        isOpen={this.props.isOpen} onClose={handleClose}>
                        <Container>
                            <MasterDetailView
                                renderMasterView={() => this.props.renderMasterView({ entity })}
                                renderDetailView={({ entity }) => {
                                    return <PickerDetailContainer>
                                        {this.props.renderDetailView && this.props.renderDetailView({ entity })}
                                        <PickerDetailFooterContainer>
                                            <Button onClick={handleClose}>Cancelar</Button>
                                            <Button
                                                intent={Intent.PRIMARY}
                                                icon={'selection'}
                                                onClick={() => handleSelect(entity.selectedItem)}>
                                                Seleccionar
                                            </Button>
                                        </PickerDetailFooterContainer>
                                    </PickerDetailContainer>;
                                }}
                            />
                        </Container>
                    </Dialog>
                </OuterContainer>;
            }}
        </Entity>;
    }
}

export default EntityPicker;

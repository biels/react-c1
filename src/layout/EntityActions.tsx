import React, {Component} from 'react';
import _ from "lodash";
import {EntityRenderProps} from "react-entity-plane";
import Actions, {ActionsProps} from "../page-templates/Actions/Actions";
import {FormRenderProps} from "react-final-form";
import {Intent} from "@blueprintjs/core";
import {Action} from "../page-templates/components/PageHeader/components/ActionArea";

export interface EntityActionsProps {
    entity: EntityRenderProps
    form?: FormRenderProps
    disable?: string[]
    minimal?: boolean
    actions?: Partial<Action>[]
    index?: number
    hideDisabled?: ActionsProps['hideDisabled']
}

class EntityActions extends Component<EntityActionsProps> {
    static defaultProps: Partial<EntityActionsProps> = {
        hideDisabled: true,
        index: 0,
    }
    render() {
        let entity = this.props.entity;
        const {single, startEditing, cancelEdition, updateEditing} = entity;
        const form = this.props.form;
        let editing = single ? entity.editing : entity.editingIndex == this.props.index;
        let actions: Action[] = [
            {
                name: 'edit',
                enabled: !editing,
                intent: Intent.PRIMARY,
                text: 'Editar',
                iconName: 'edit',
                callback: () => startEditing(this.props.index || 0)
            },
            {
                name: 'cancelEdition',
                enabled: editing,
                text: 'Cancelar',
                iconName: 'cross',
                callback: () => cancelEdition()
            },
            {
                name: 'reset',
                enabled: editing && form && !form.pristine,
                text: 'Limpiar',
                iconName: 'undo',
                callback: () => form.reset()
            },
            {
                name: 'save',
                enabled: editing && form && !form.pristine,
                text: 'Guardar',
                iconName: 'floppy-disk',
                callback: () => {
                    updateEditing(form.values);
                    cancelEdition();
                }
            },
            {
                name: 'open',
                enabled: false,
                iconName: 'edit',
                text: 'Detalles / Editar',
                callback: () => entity.openInOwnPage(entity.selectedItem.id as number, {}, true),
            },
            {
                name: 'remove',
                enabled: !single && !editing,
                iconName: 'trash',
                text: 'Eliminar',
                callback: () => entity.remove(this.props.index),
                confirmation: true,
                confirmationText: '¿Are you sure you want to delete this item?'
            },
        ]

        const mergeActionWithDefaults = (action) => {
            const defaults = actions.find(a => a.name === name)
            return _.defaultsDeep(action, defaults)
        };

        const finalActions = this.props.actions.map(mergeActionWithDefaults);
        actions = _.merge(actions, this.props.actions) // TODO Improve merging
        if (this.props.disable != null)
            actions = actions.filter(a => _.find(this.props.disable, s => s == a.name) != null);
        return <Actions actions={finalActions} hideDisabled={this.props.hideDisabled} minimal={this.props.minimal}/>
    }
}

export default EntityActions;

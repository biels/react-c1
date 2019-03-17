import React, {Component, ComponentType} from 'react';
import * as _ from "lodash";
import {Form, FormProps, FormRenderProps} from "react-final-form";
import {Action} from "../page-templates/components/PageHeader/components/ActionArea";
import {FormApi} from "final-form";
import EntityField from "./EntityField";
import FormAutoSave from "./FormAutoSave";
import {Entity, EntityContextProvider, EntityProps, EntityRenderProps, EntityFieldInfo, EntityFieldType} from 'react-entity-plane';

import createDecorator from 'final-form-focus'
import {D} from "../page-templates/utils/debug";
import {BaseEntityFieldInfo} from 'react-entity-plane/src/types/fieldsInfo';

const d = D('EntityView')
const focusOnErrors = createDecorator(
    // () => {
    //
    // },
    //  (inputs: { name: string, focus: () => void }[]) => {
    //     console.log(`Inputs`, inputs);
    //     return _.first(inputs.filter(i => i.name != null))
    // }
)

interface FormWrapperRenderProps {
    entity: EntityRenderProps
    actions?: Action[]
}

type CRUDMode = 'viewing' | 'editing' | 'creating';

export interface AutoFieldProps extends Partial<BaseEntityFieldInfo> {

}

export interface EntityViewProps {
    name?: EntityProps['name']
    relation?: EntityProps['relation']
    root?: EntityProps['root']
    entity?: EntityRenderProps
    associate?: { [fieldName: string]: EntityRenderProps } | EntityRenderProps

    ids?: EntityProps['ids']
    index?: number
    wrapper?: ComponentType<FormWrapperRenderProps | any>
    wrapperProps?: ((entity: EntityRenderProps, form: FormRenderProps) => any) | Object
    children?: (entity: EntityRenderProps, mode: CRUDMode, field: (name: string, props?: AutoFieldProps) => any, form?: FormRenderProps) => any
    creating?: boolean;
    editing?: boolean;
    onFormReady?: (submit: FormRenderProps) => any
    onSubmit?: (entity: EntityRenderProps, values: object, mode: 'editing' | 'creating', form: FormApi, callback) => any
    afterSubmit?: () => any
    transform?: (values) => object
    initialValues?
    disableAutoAppend?: boolean
}

/**
 * View for an entity. Supports creation, edition and visualization.
 * Provides a default Field component. Depends on fields attribute in entityInfo.
 */
class EntityView extends Component<EntityViewProps> {
    static defaultProps: Partial<EntityViewProps> = {
        transform: (values) => values,
        afterSubmit: () => null,
        associate: {}
    }
    optimisticValues = null
    optimisticValuesId = null
    onSubmit = (entity, values, mode, form, callback) => {
        values = this.props.transform(values)
        if (mode === 'editing') {
            if (!entity.selectedItem) {
                console.log(`Tried to edit an entity without selection`);
                return
            }
            console.log(`Edit values:`, values, entity);
            entity.updateId(entity.selectedItem.id, values)
            // entity.cancelEdition()
        }
        if (mode === 'creating') {
            console.log(`Create values:`, values, entity);
            entity.create(values)
        }
    }

    render() {
        if (this.props.children == null) return null;
        if (this.props.creating && this.props.editing) return 'Creating and editing at the same time';
        let renderWithEntity = (entity: EntityRenderProps) => {
            if (entity == null) return <div>No entity provided</div>;
            const renderWithWrapper = (inner, form?) => {
                let inside = <EntityContextProvider rootEntityId={this.props.entity.selectedId}>
                    {inner}
                    {!this.props.disableAutoAppend && renderExtraFields(form != null)}
                </EntityContextProvider>;
                if (this.props.wrapper != null) {
                    const Wrapper = this.props.wrapper
                    if (Wrapper != null) {
                        let wp = this.props.wrapperProps
                        if (_.isFunction(wp)) wp = (wp as any)(entity, form)
                        return <Wrapper entity={entity} form={form} {...wp}>
                            {inside}
                        </Wrapper>
                    }
                }
                return inside;
            }
            const renderExtraFields = (inForm) => {
                // TODO Filter associate fields appropriately by default
                const pendingFields = entity.entityInfo.fields.filter(f => !rendered.includes(f.name))
                // .filter(f => !_.entries(this.props.associate)
                //     .filter(e => e[1] != null)
                //     .map(e => e[0])
                //     .includes(f.name)
                // )
                return pendingFields.map(f => field(inForm, false)(f.name))
            }
            const rendered = [];


            let creating = this.props.creating;
            let editing = this.props.editing;
            if (creating) editing = false;
            if (editing) creating = false;
            const mode: CRUDMode = creating ? 'creating' : (editing ? 'editing' : 'viewing')

            // TODO Initial values should already contain associations, and if associations are enforced the fields
            // should be ommitted and if present they should be rendered as disabled
            let oldAssociate: EntityRenderProps = this.props.associate as EntityRenderProps;
            let associate: { [entityName: string]: EntityRenderProps };
            // console.log(`associate`, this.props.associate, associate);
            if (oldAssociate != null && _.isFunction(oldAssociate.selectId)) {
                associate = {[oldAssociate.entityInfo.name]: oldAssociate}
            } else {
                associate = this.props.associate as { [entityName: string]: EntityRenderProps }
            }

            const field = (inForm: boolean, register: boolean = true) => (name: string, props?: AutoFieldProps) => {
                if (props == null) props = {name}
                if (register) rendered.push(props.name);
                let disabled = !!(_.get(associate, name))

                return <EntityField key={name || props.name} entity={entity} inForm={inForm} specificInfo={props}
                                    creating={creating} disabled={disabled}/>
            };

            //if (!entity.single) editing = entity.editingIndex == this.props.index;
            if (editing || creating) {
                const handleSubmit: FormProps['onSubmit'] = (values, form, callback) => {
                    // console.log(`Mode`, mode);
                    this.optimisticValuesId = _.get(entity, 'selectedItem.id')
                    this.optimisticValues = {...form.getState().values}
                    this.onSubmit(entity, values, mode as any, form, callback);
                    this.props.afterSubmit()
                    // setTimeout(() => this.optimisticValues = null, 1000)
                };
                let valueFieldNames = entity.entityInfo.fields
                    .filter(f => f.type !== EntityFieldType.relation)
                    .map(f => f.name);
                let relationFieldNames = entity.entityInfo.fields
                    .filter(f => f.type === EntityFieldType.relation)
                    .map(f => f.name);
                let initialValues = {};
                if (editing) {
                    let associationValues = relationFieldNames.map(rf => {
                        if (entity.selectedItem == null) return null;
                        let selectedItemElement = entity.selectedItem[rf];
                        if (selectedItemElement == null) return null;
                        return {[rf]: {connect: {id: selectedItemElement.id}}}
                    }).reduce((previousValue, currentValue, i) => {
                        return Object.assign(previousValue, currentValue)
                    }, {});
                    initialValues = {..._.pick(entity.selectedItem, valueFieldNames)};
                    initialValues = {
                        ...initialValues, ...associationValues
                    }
                }

                let associationValues = relationFieldNames
                    .filter(rf => _.keys(associate).includes(rf) && associate[rf] != null)
                    .map(rf => {
                        const associateElement = associate[rf];
                        if (associateElement == null) return null;
                        let selectedItem = associateElement.selectedItem;
                        if (selectedItem == null) return null;
                        return {[rf]: {connect: {id: selectedItem.id}}}
                    }).reduce((previousValue, currentValue, i) => {
                        return Object.assign(previousValue, currentValue)
                    }, {});
                if (creating) {
                    const externalInitialValues = this.props.initialValues || {}
                    initialValues = entity.entityInfo.fields
                        .map(f => {
                            if (externalInitialValues[f.name] != null) {
                                // Copy relations
                                if (f.type === EntityFieldType.relation) return {[f.name]: {connect: {id: externalInitialValues[f.name].id}}}
                                // Copy value objects
                                return {[f.name]: externalInitialValues[f.name]}
                            }
                            // Use defaults
                            return (f.default != null ? {[f.name]: (_.isFunction(f.default) ? f.default(): f.default) } : {});
                        })
                        .reduce((o1, o2) => Object.assign(o1, o2), {})
                    initialValues = {
                        ...initialValues, ...associationValues
                    }
                    // Remove id since we are creating a new instance
                    initialValues['id'] = undefined
                    // console.log(`Creating associationValues`, associationValues, initialValues);
                }
                let useOptimisticValues = this.optimisticValues != null && this.optimisticValuesId === _.get(entity, 'selectedItem.id', -1);
                return <Form onSubmit={handleSubmit}
                             initialValues={useOptimisticValues ? this.optimisticValues : initialValues}
                             decorators={[focusOnErrors]}
                >
                    {(form) => {
                        if (this.props.onFormReady) this.props.onFormReady(form)
                        // console.log(`Rendered `, initialValues, this.optimisticValues);
                        return <form style={{position: 'relative'}} onSubmit={form.handleSubmit}>
                            {d() && 'Associating: ' + JSON.stringify(Object.keys(associationValues))}
                            {d() && ' Values: ' + JSON.stringify(form.values)}
                            {(editing && !creating && form.valid) &&
                            <FormAutoSave id={_.get(entity, 'selectedItem.id')} debounce={1200} form={form}
                                          save={handleSubmit as any}/>}
                            {renderWithWrapper(this.props.children(entity, mode, field(true), form), form)}
                            {/*<button type={'submit'} id={'submit-new-' + entity.entityInfo.name} hidden={false}>Hidden*/}
                            {/*submit*/}
                            {/*</button>*/}
                        </form>
                    }}
                </Form>
            } else {
                return renderWithWrapper(this.props.children(entity, mode, field(false)))
            }
        };
        if (!this.props.entity) {
            return <Entity name={this.props.name} relation={this.props.relation} root={this.props.root}>
                {(entity) => renderWithEntity(entity)}
            </Entity>
        } else {
            return renderWithEntity(this.props.entity)
        }
    }
}

export default EntityView;

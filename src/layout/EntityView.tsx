import React, {Component, ComponentType} from 'react';
import * as _ from "lodash";
import {Form, FormProps, FormRenderProps} from "react-final-form";
import {Action} from "../page-templates/components/PageHeader/components/ActionArea";
import {FormApi} from "final-form";
import EntityField from "./EntityField";
import FormAutoSave from "./FormAutoSave";
import {Entity, EntityContextProvider, EntityFieldInfo, EntityProps, EntityRenderProps} from 'react-entity-plane';
import {EntityFieldType} from "react-entity-plane/src/types/fieldsInfo";
import {renderToJson} from "enzyme-to-json";


interface FormWrapperRenderProps {
    entity: EntityRenderProps
    actions?: Action[]
}

type CRUDMode = 'viewing' | 'editing' | 'creating';

export interface AutoFieldProps extends Partial<EntityFieldInfo> {

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
    onSubmitReady?: (submit: Function) => any
    onSubmit?: (entity: EntityRenderProps, values: object, mode: 'editing' | 'creating', form: FormApi, callback) => any
    afterSubmit?: () => any
    transform?: (values) => object
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
                    {renderExtraFields(form != null)}
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
                const pendingFields = entity.entityInfo.fields.filter(f => !rendered.includes(f.name))
                    .filter(f => !_.entries(this.props.associate)
                        .filter(e => e[1] != null)
                        .map(e => e[0])
                        .includes(f.name)
                    )
                return pendingFields.map(f => field(inForm, false)(f.name))
            }
            const rendered = [];
            const field = (inForm: boolean, register: boolean = true) => (name: string, props?: AutoFieldProps) => {
                if (props == null) props = {name}
                if (register) rendered.push(props.name);
                return <EntityField key={name || props.name} entity={entity} inForm={inForm} specificInfo={props}
                                    creating={creating}/>
            }

            let creating = this.props.creating;
            let editing = this.props.editing;
            if (creating) editing = false;
            if (editing) creating = false;
            const mode: CRUDMode = creating ? 'creating' : (editing ? 'editing' : 'viewing')

            //if (!entity.single) editing = entity.editingIndex == this.props.index;
            if (editing || creating) {
                const handleSubmit: FormProps['onSubmit'] = (values, form, callback) => {
                    // console.log(`Mode`, mode);
                    this.onSubmit(entity, values, mode as any, form, callback);
                    this.props.afterSubmit()
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
                    initialValues = _.pick(entity.selectedItem, valueFieldNames);
                    initialValues = {
                        ...initialValues, ...associationValues
                    }
                }
                // TODO Initial values should already contain associations, and if associations are enforced the fields
                // should be ommitted and if present they should be rendered as disabled
                if (creating) {
                    let oldAssociate: EntityRenderProps = this.props.associate as EntityRenderProps;
                    let associate: {[entityName: string]: EntityRenderProps};
                    // console.log(`associate`, this.props.associate, associate);
                    if(oldAssociate != null && _.isFunction(oldAssociate.selectId)){
                        associate = {[oldAssociate.entityInfo.name]: oldAssociate}
                    }else{
                        associate = this.props.associate as {[entityName: string]: EntityRenderProps}
                    }
                    let associationValues = relationFieldNames.filter(rf => _.keys(associate).includes(rf))
                        .map(rf => {
                            const associateElement = associate[rf];
                            console.log('associateElement', associateElement);
                            if (associateElement == null) return null;
                            let selectedItem = associateElement.selectedItem;
                            if (selectedItem == null) return null;
                            return {[rf]: {connect: {id: selectedItem.id}}}
                        }).reduce((previousValue, currentValue, i) => {
                            return Object.assign(previousValue, currentValue)
                        }, {});
                    initialValues = entity.entityInfo.fields
                        .map(f => (f.default != null ? {[f.name]: f.default} : {}))
                        .reduce((o1, o2) => Object.assign(o1, o2), {})
                    initialValues = {
                        ...initialValues, ...associationValues
                    }
                    console.log(`Creating associationValues`, associationValues);
                }
                return <Form onSubmit={handleSubmit}
                             initialValues={initialValues}
                >
                    {(form) => {
                        if (this.props.onSubmitReady) this.props.onSubmitReady(form.handleSubmit)
                        return <form onSubmit={form.handleSubmit}>
                            {(editing && !creating) &&
                            <FormAutoSave debounce={1200} form={form} save={handleSubmit as any}/>}
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

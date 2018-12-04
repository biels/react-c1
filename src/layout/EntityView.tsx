import React, {Component, ComponentType, FunctionComponent} from 'react';
import _ from "lodash";
import Entity, {EntityProps, EntityRenderProps} from "react-entity-plane/lib/Entity";
import {Form, FormProps, FormRenderProps} from "react-final-form";
import {Action} from "../page-templates/components/PageHeader/components/ActionArea";
import {FormApi} from "final-form";
import EntityField from "./EntityField";
import {EntityFieldInfo} from "react-entity-plane/lib/types/fieldsInfo";
import FormAutoSave from "./FormAutoSave";



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
}

/**
 * View for an entity. Supports creation, edition and visualization.
 * Provides a default Field component. Depends on fields attribute in entityInfo.
 */
class EntityView extends Component<EntityViewProps> {
    static defaultProps: Partial<EntityViewProps> = {
        onSubmit: (entity, values, mode, form, callback) => {
            console.log(`Submitting`, mode);
            if (mode === 'editing') {
                if(!entity.selectedItem) {
                    console.log(`Tried to edit an entity without selection`);
                    return
                }
                console.log(`E`, entity.items);
                entity.updateId(entity.selectedItem.id, values)
                // entity.cancelEdition()
            }
            if (mode === 'creating') {
                entity.create(values)
            }
        },
        afterSubmit: () => null
    }

    render() {
        if(this.props.children == null) return null;
        let renderWithEntity = (entity: EntityRenderProps) => {
            if(entity == null) return <div>No entity provided</div>;
            const renderWithWrapper = (inner, form?) => {
                if (this.props.wrapper != null) {
                    const Wrapper = this.props.wrapper
                    if (Wrapper != null) {
                        let wp = this.props.wrapperProps
                        if (_.isFunction(wp)) wp = (wp as any)(entity, form)
                        return <Wrapper entity={entity} form={form} {...wp}>
                            {inner}
                            {renderExtraFields(form != null)}
                        </Wrapper>
                    }
                }
                return inner
            }
            const renderExtraFields = (inForm) => {
                const pendingFields = entity.entityInfo.fields.filter(f => !rendered.includes(f.name));
                return pendingFields.map(f => field(inForm, false)(f.name))
            }
            const rendered = [];
            const field = (inForm: boolean, register: boolean = true) => (name: string, props?: AutoFieldProps) => {
                if (props == null) props = {name}
                if(register)rendered.push(props.name);
                return <EntityField key={name || props.name} entity={entity} inForm={inForm} specificInfo={props} creating={creating}/>
            }

            let creating = this.props.creating || entity.creating;
            let editing = this.props.editing || entity.editing;
            if(creating) editing = false;
            if(editing) creating = false;
            const mode: CRUDMode = creating ? 'creating' : (editing ? 'editing' : 'viewing')

            if (!entity.single) editing = entity.editingIndex == this.props.index;
            if (editing || creating) {
                const handleSubmit: FormProps['onSubmit'] = (values, form, callback) => {
                    console.log(`SUB`);
                    this.props.onSubmit(entity, values, mode as any, form, callback);
                    this.props.afterSubmit()
                };
                let fieldNames = entity.entityInfo.fields.map(f => f.name);
                let initialValues = {};
                if (editing) initialValues = _.pick(entity.selectedItem, fieldNames);
                if (creating) initialValues = entity.entityInfo.fields
                    .map(f => (f.default != null ? {[f.name]: f.default} : {}))
                    .reduce((o1, o2) => Object.assign(o1, o2), {})
                return <Form onSubmit={handleSubmit}
                             initialValues={initialValues}
                >
                    {(form) => {
                        if(this.props.onSubmitReady)this.props.onSubmitReady(form.handleSubmit)
                        return <form onSubmit={form.handleSubmit}>
                            {editing && <FormAutoSave debounce={100} values={form.values} save={handleSubmit as any}/>}
                            {renderWithWrapper(this.props.children(entity, mode, field(true), form), form)}
                            <button type={'submit'} id={'submit-new-' + entity.entityInfo.name} hidden={false}>Hidden submit</button>
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

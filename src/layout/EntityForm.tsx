import React, {Component, ComponentType, ReactNode} from 'react';
import _ from "lodash";
import Entity, {EntityProps, EntityRenderProps} from "react-entity-plane/lib/Entity";
import {Action} from "../page-templates/components/PageHeader/components/ActionArea";
import {Form, FormRenderProps} from "react-final-form";

interface FormWrapperRenderProps {
    entity: EntityRenderProps
    actions?: Action[]
}

export interface FormEntityProps {
    name?: EntityProps['name']
    relation?: EntityProps['relation']
    root?: EntityProps['root']
    ids?: EntityProps['ids']
    index?: number
    wrapper?: ComponentType<FormWrapperRenderProps | any>
    wrapperProps?: ((entity: EntityRenderProps, form: FormRenderProps) => any) | Object
    editorView: (entity: EntityRenderProps, form: FormRenderProps) => any
    readonlyView?: (entity: EntityRenderProps) => any
    fields: string[]
}

class EntityForm extends Component<FormEntityProps> {
    static defaultProps: Partial<FormEntityProps> = {
        fields: ['id', 'name']
    }
    shouldComponentUpdate(){
        return false
    }
    render() {
        return <Entity name={this.props.name} relation={this.props.relation} root={this.props.root}>
            {(entity: EntityRenderProps) => {
                const renderWithWrapper = (inner, form?) => {
                    if (this.props.wrapper != null) {
                        const Wrapper = this.props.wrapper
                        if (Wrapper != null) {
                            let wp = this.props.wrapperProps
                            if (_.isFunction(wp)) wp = (wp as any)(entity, form)
                            return <Wrapper entity={entity} form={form} {...wp}>
                                {inner}
                            </Wrapper>
                        }
                    }
                    return inner
                }

                const handleSubmit = (values) => {
                    entity.updateEditing(values)
                    entity.cancelEdition()
                }

                let editing = entity.editing;
                if(!entity.single) editing = entity.editingIndex == this.props.index;
                if (editing || this.props.readonlyView == null) {
                    return <Form onSubmit={handleSubmit}
                                 initialValues={_.pick(entity.items[entity.editingIndex], this.props.fields)}
                    >
                        {(form) => {
                            return <form onSubmit={form.handleSubmit}>
                                {renderWithWrapper(this.props.editorView(entity, form), form)}
                            </form>
                        }}
                    </Form>
                } else {
                    return renderWithWrapper(this.props.readonlyView(entity))
                }
            }}
        </Entity>
    }
}

export default EntityForm;

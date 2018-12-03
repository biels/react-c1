import React, {Component} from 'react';
import {Field as FormField} from "react-final-form";
import {FormGroup, InputGroup, Switch} from "@blueprintjs/core";
import {EntityFieldInfo, EntityFieldType} from 'react-entity-plane/lib/types/fieldsInfo';
import MaskedInput from 'react-text-mask';
import {EntityRenderProps} from "react-entity-plane/lib/Entity";
import * as _ from "lodash";
import {fieldDefaults} from "../defaults/fieldDefaults";


export interface EntityFieldProps {
    entity: EntityRenderProps
    specificInfo: Partial<EntityFieldInfo>
    inForm: boolean
    creating: boolean
}

class EntityField extends Component<EntityFieldProps> {
    render() {
        const {specificInfo, ...rest} = this.props;
        const name = specificInfo.name;
        const baseInfo = this.props.entity.entityInfo.fields.find(fi => fi.name === name)
        if (baseInfo == null) {
            console.log(`R null`);
            return null;
        }
        const matchingDefaults = fieldDefaults.filter(fd => {
            let match: (string | RegExp)[] = fd.match as any;
            if (!_.isArray(match)) match = [match]
            return match.some(m => _.isRegExp(m) ? m.test(name) : m === name)
        }).map(md => md.info);
        const field: EntityFieldInfo = _.defaultsDeep({}, specificInfo, baseInfo, ...matchingDefaults);
        const validation = (field || {} as any).validation
        const mask = (field || {} as any).mask
        const hasMask = mask != null && mask.mask != null;
        const isBoolean = field.type === EntityFieldType.boolean;
        if (this.props.creating && field.create === false) return null;
        if (this.props.inForm) {
            return <FormField name={field.name} type={isBoolean ? 'checkbox' : undefined}>
                {({input: formInput, meta}) => {

                    if (field.type === EntityFieldType.boolean) {
                        console.log(`Forminput`, formInput);
                        return  <Switch {...formInput} checked={formInput.value} label={field.label || field.name} />
                    }
                    if (true) {
                        // All other types
                        const renderFormGroup = (ref, props) => {
                            return <FormGroup label={field.label || field.name} helperText={!mask ? null : 'Mask'}>
                                <InputGroup inputRef={ref as any} {...props} placeholder={field.label || field.name}
                                            leftIcon={field.icon as any} large={false} autoComplete={'offf'}/>
                            </FormGroup>;
                        }
                        if (hasMask) {
                            return <MaskedInput
                                mask={mask.mask}
                                guide={mask.guide}
                                placeholderChar={mask.placeholderChar}
                                keepCharPositions={mask.keepCharPositions}
                                pipe={mask.pipe}
                                showMask={mask.showMask}
                                {...formInput}
                                render={(ref, props) => {
                                    return renderFormGroup(ref, props)
                                }}
                            />
                        } else {
                            return renderFormGroup(null, formInput)
                        }
                    }

                }}
            </FormField>
        }
        return <React.Fragment>
            Field
        </React.Fragment>
    }
}

export default EntityField;

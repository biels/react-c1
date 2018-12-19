import React, {Component} from 'react';
import {Field as FormField} from "react-final-form";
import {FormGroup, HTMLSelect, InputGroup, Switch, TextArea} from "@blueprintjs/core";
import {EntityFieldInfo, EntityFieldType} from 'react-entity-plane';
import MaskedInput from 'react-text-mask';
import {EntityRenderProps} from "react-entity-plane";
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
        let entityInfo = this.props.entity.entityInfo;
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
                    const renderFormGroup = (props, input) => {
                        return <FormGroup label={field.label || field.name} helperText={!mask ? null : 'Mask'}>
                            {input}
                        </FormGroup>;
                    }
                    let label = field.label || field.name;
                    if (field.type === EntityFieldType.boolean) {
                        return  <Switch {...formInput} checked={formInput.value} label={label} />
                    }
                    if (field.type === EntityFieldType.textarea) {
                        return renderFormGroup(formInput, <TextArea {...formInput} placeholder={label} fill={true}/>)
                    }
                    if (field.type === EntityFieldType.relation) {
                        const relationInfo = entityInfo.relations[field.name];
                        if(relationInfo == null) {
                            console.log(`Could not find relation info for ${field.name} in ${entityInfo.name}`);
                            return null;
                        }
                        if(relationInfo.type ===  'multi') return null;
                        return renderFormGroup(formInput, <HTMLSelect {...formInput} placeholder={label}/>)
                    }



                    if (true) {
                        // All other types
                        const renderInputGroup = (ref, props) => <InputGroup inputRef={ref as any} {...props}
                                                                             placeholder={label}
                                                                             leftIcon={field.icon as any} large={false}
                                                                             autoComplete={'offf'}/>;
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
                                    return renderFormGroup(props, renderInputGroup(ref, props))
                                }}
                            />
                        } else {
                            return renderFormGroup(formInput, renderInputGroup(null, formInput))
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

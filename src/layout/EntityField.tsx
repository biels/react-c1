import React, {Component} from 'react';
import {Field as FormField} from "react-final-form";
import {Button, FormGroup, InputGroup, Intent, MenuItem, Switch, TextArea} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import {DateInput} from "@blueprintjs/datetime";

import {Entity, EntityFieldInfo, EntityRenderProps, LoadingQuery} from 'react-entity-plane';
import MaskedInput from 'react-text-mask';
import * as _ from "lodash";
import {fieldDefaults} from "../defaults/fieldDefaults";
import {getDisplayName} from "../page-templates/utils/getDisplayName";
import moment from 'moment';
import {EntityFieldType, FieldEnumValues} from "react-entity-plane/src/types/fieldsInfo";
import {createNumberMask} from "text-mask-addons/dist/textMaskAddons";
import {D} from "../page-templates/utils/debug";
const d = D('Entity Field')

export interface EntityFieldProps {
    entity: EntityRenderProps
    specificInfo: Partial<EntityFieldInfo>
    inForm: boolean
    creating: boolean
    disabled: boolean
}

class EntityField extends Component<EntityFieldProps> {
    render() {
        const {specificInfo, ...rest} = this.props;
        const name = specificInfo.name;
        const baseInfo = this.props.entity.entityInfo.fields.find(fi => fi.name === name)
        let entityInfo = this.props.entity.entityInfo;
        if (baseInfo == null) {
            console.log(`[Entity View] Field ${name} is not defined on ${entityInfo.name}`);
            return null;
        }
        // TODO Generalize
        const matchingDefaults = fieldDefaults.filter(fd => {
            let match: (string | RegExp)[] = fd.match as any;
            if (!_.isArray(match)) match = [match]
            return match.some(m => _.isRegExp(m) ? m.test(name) : m === name)
        }).map(md => md.info);
        const field: EntityFieldInfo = _.defaultsDeep({}, specificInfo, baseInfo, ...matchingDefaults);
        const validation = (field || {} as any).validation || {}
        let mask = (field || {} as any).mask
        let hasMask = mask != null && mask.mask != null;
        const isBoolean = field.type === EntityFieldType.boolean;
        if (this.props.creating && field.create === false) return null;
        if (this.props.inForm) {
            let parse, format;
            if (field.type === EntityFieldType.number) {
                hasMask = true;
                // TODO Forcefully placed mask, place in defaults to allow custom masks
                let mask1 = createNumberMask({
                    prefix: '',
                    suffix: '', // This will put the dollar sign at the end, with a space.
                    includeThousandsSeparator: false,
                    allowDecimal: true,
                });
                mask = {
                    mask: mask1
                }
                parse = v => {
                    if (v == null) return null;
                    if (v === '') return null;
                    d(`Parsing`, JSON.stringify(v), JSON.stringify(parseFloat(v)), JSON.stringify(parseInt(v)));
                    // if(!_.isFinite(v)) return v;

                    return parseFloat(v);
                }
                format = v => {
                    //Currently using mask that already provides good format by default
                    return v;
                }
            }

            let validate = (value, allValues) => {
                if (value == null) {
                    if (field.required) return 'required';
                    return null;
                }
                if (validation.custom) return validation.custom(value, allValues);
                if (validation.maxLength && value.toString().length > validation.maxLength) return 'length exceeded';
                if (validation.minLength && value.toString().length < validation.maxLength) return 'length not fulfilled';
                if (validation.max && value > validation.max) return 'max not fulfilled';
                if (validation.min && value < validation.min) return 'min not fulfilled';
                if (validation.match && validation.match.test(value.toString())) return 'match not fulfilled';
                if (field.type === EntityFieldType.number && !_.isFinite(parseFloat(value))) return 'number invalid';
                return undefined;
            };
            return <FormField name={field.name} type={isBoolean ? 'checkbox' : undefined} parse={parse}
                              format={format} validate={validate} allowNull={true} formatOnBlur={true} >
                {({input: formInput, meta}) => {
                    let showInvalid = (meta.invalid && !this.props.creating) || (meta.invalid && (meta.touched || meta.submitError || meta.dirty));
                    let intent = (meta.error && showInvalid) ? Intent.DANGER : null;
                    const renderFormGroup = (props, input) => {
                        let maskIndicator = !mask ? undefined : '(Mask)';
                        let helperText = [field.help, meta.error].join(' ');
                        let label = [field.label || field.name].join(' ');
                        return <FormGroup label={label} labelInfo={!field.required ? '(opcional)' : undefined}
                                          helperText={helperText} intent={intent} disabled={this.props.disabled && false}>
                            {input}
                        </FormGroup>;
                    }
                    let label = field.label || field.name;
                    if (field.type === EntityFieldType.boolean) {
                        return renderFormGroup(formInput, <Switch {...formInput} name={field.name} checked={formInput.value} label={label}/>)
                    }
                    if (field.type === EntityFieldType.textarea) {
                        return renderFormGroup(formInput, <TextArea style={{height: 220}} name={field.name} {...formInput} placeholder={label} fill={true}/>)
                    }
                    if (field.type === EntityFieldType.date) {
                        let format = 'DD/MM/YYYY';
                        const parseDate = raw => moment(raw, format).toDate()
                        const formatDate = date => moment(date).format(format)
                        return renderFormGroup(formInput, <DateInput
                            parseDate={parseDate}
                            formatDate={formatDate}
                            name={field.name}
                            {...formInput}
                            value={formInput.value ? new Date(formInput.value) : null}
                            placeholder={label}
                        />)
                    }
                    if (field.type === EntityFieldType.enum) {
                        const values = field.values || [];
                        let emptyItem: FieldEnumValues = {
                            icon: field.icon,
                            display: '---',
                            value: null
                        };
                        const selectedValue = values.find((v) => v.value === formInput.value) || emptyItem
                        const select = <Select items={values}
                                               filterable={false}
                                               noResults={<MenuItem disabled={true} text={`No hi ha valors definits`} />}
                                               itemRenderer={(item, info) => <MenuItem onClick={info.handleClick}
                                                                                       text={item.display || item.value}
                                                                                       icon={item.icon}
                                                                                       intent={item.intent}/>}
                                               onItemSelect={(item, event) => formInput.onChange(item.value)}>
                            <Button rightIcon="double-caret-vertical"
                                    icon={selectedValue.icon}
                                    intent={selectedValue.showThrough ? selectedValue.intent : intent}
                            >{selectedValue.display || selectedValue.value}</Button>
                        </Select>
                        return renderFormGroup(formInput, select)
                    }
                    if (field.type === EntityFieldType.relation) {
                        const relationInfo = entityInfo.relations[field.name];
                        if (relationInfo == null) {
                            console.log(`[Entity View] Could not find relation info for ${field.name} in ${entityInfo.name}`);
                            return null;
                        }
                        if (relationInfo.type === 'multi') return null;
                        return <Entity name={relationInfo.entityName}>
                            {(entity) => {
                                //console.log(`Entity`, entity);
                                const displayItems = entity.items
                                if (formInput.value == null && entity.selectedItem != null) return null;

                                let id = _.get(formInput.value, 'connect.id', null);
                                //entity.selectId(id, false);
                                let selectedItem = entity.items.find(it => it.id === id);
                                //console.log(`id ${id}`, selectedItem);
                                //console.log(`ActiveItem`, selectedItem);
                                let select = <Select
                                    items={entity.items}
                                    itemRenderer={(item, info) => {
                                        return <MenuItem onClick={info.handleClick} disabled={false}
                                                         text={getDisplayName(item)}/>;
                                    }}
                                    onItemSelect={(item, event) => {
                                        //console.log(`selected `, item);
                                        //entity.selectId(item.id as any)
                                        // Change to support different association formats
                                        formInput.onChange({connect: {id: item.id}});
                                    }}
                                    noResults={<MenuItem disabled={true} text={`No hi ha ${_.get(entity, 'entityInfo.display.plural', 'elements').toLowerCase()}`} />}
                                    activeItem={selectedItem}
                                    filterable={false}
                                    disabled={this.props.disabled}
                                    popoverProps={{minimal: true}}
                                >
                                    <Button name={field.name} text={getDisplayName(selectedItem)} rightIcon="double-caret-vertical"
                                            icon={entity.entityInfo.display.icon} disabled={this.props.disabled}/>
                                </Select>;
                                return renderFormGroup(formInput, select)
                            }}
                        </Entity>
                    }

                    if (true) {
                        // All other types
                        const renderInputGroup = (ref, props) => {
                            return <InputGroup inputRef={ref as any} {...props}
                                               name={field.name}
                                               placeholder={label}
                                               leftIcon={field.icon as any} large={false}
                                               autoComplete={'offf'}
                                               intent={intent}
                                               disabled={this.props.disabled}
                            />;
                        };


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
            Field({this.props.specificInfo.name})
        </React.Fragment>
    }
}

export default EntityField;

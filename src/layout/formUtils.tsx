import {Field} from "react-final-form";
import React, {ReactChildren, ReactNode, SFC} from "react";
import {OnChange} from 'react-final-form-listeners'
import _ from 'lodash'
import {NonIdealState} from "@blueprintjs/core";
import {Namespace} from "react-namespaces";

export const WhenFieldChanges = ({field, becomes, set, to}) => (
    <Field name={set} subscription={{}}>
        {(
            // No subscription. We only use Field to get to the change function
            {input: {onChange}}
        ) => (
            <OnChange name={field}>
                {value => {
                    if (value === becomes) {
                        onChange(to)
                    }
                }}
            </OnChange>
        )}
    </Field>
)
export const Inject = ({name, value}: { name: string, value: Object }) => {
    return <Field name={name}>
        {(
            {input: {onChange, value: oldValue}}
        ) => {
            if (!_.isEqual(oldValue, value)) {
                // console.log('Injected', JSON.stringify(oldValue), JSON.stringify(value));
                setTimeout(() => onChange(value))
            }
            return null
        }}
    </Field>
}

export const FieldValue = ({name, nullable = false, children}: { name: string, nullable?: boolean, children: (value: Object) => JSX.Element }) => {
    return <Field name={name}>
        {({input: {value}}) => {
            if(!nullable && (value == "" || value == null))
                return <NonIdealState
                    icon={"error"}
                    title={'Undefined field'}
                    description={'Field ' + name + ' is not defined'}/>
            // console.log('reading field', name, JSON.stringify(value));
            return children(value)
        }}
    </Field>
}

const LocalFieldFactory = ({fieldComponent: FieldComponent = Field}) => ({children, name}) => {
    return <Namespace>
        {(namespace) => {
            return <FieldComponent name={namespace.concat(name).join('.')}>
                {(field) => {
                    return children(field)
                }}
            </FieldComponent>
        }}
    </Namespace>
}
export const LocalField = LocalFieldFactory({fieldComponent: Field})
export const LocalFieldValue = LocalFieldFactory({fieldComponent: FieldValue})
// export const TwoFields = ({children}) => {
//     let extract2 = ({f1, f2}) => <Field name={'f3'}>
//         {(f3) => {
//             return children({f1, f2, f3})
//         }}
//     </Field>;
//     let extract = ({f1}) => <Field name={'f2'}>
//         {(f2) => {
//             return extract2({f1, f2})
//         }}
//     </Field>;
//     return <Field name={'f1'}>
//         {(f1) => {
//             return extract({f1})
//         }}
//     </Field>
// }
// export const ThreeFields = ({children}) => {
//     let extract2 = (fields) => <Field name={'f3'}>
//         {(f3) => {
//             return children({...fields, f3})
//         }}
//     </Field>;
//     let extract = (fields) => <Field name={'f2'}>
//         {(f2) => {
//             return extract2({...fields, f2})
//         }}
//     </Field>;
//     return <Field name={'f1'}>
//         {(f1) => {
//             return extract({f1})
//         }}
//     </Field>
// }
// export const Fields = ({names, children}: { names: string[], children: (props) => (fields) => Element }) => {
//     const Composed = names.reduce((pv, name, i, iv) =>
//         ({children, ...rest}) => <Field name={name}>
//             {(field) => {
//                 return children({[name]: field, ...rest})
//             }}
//         </Field>, children)
//     return Composed
// }

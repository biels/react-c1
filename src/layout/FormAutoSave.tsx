import React, {Component} from 'react';
import styled from "styled-components";
import diff from 'object-diff'
import {Intent, Spinner} from "@blueprintjs/core";
import * as _ from "lodash";
import Timer = NodeJS.Timer;
import {FormRenderProps} from "react-final-form";
import {dir} from "async";

const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    padding: 16px;
    border: 2px solid blue;
    background: aqua;
`

export interface FormAutoSaveState {
    values: any
    submitting: boolean
}

export interface FormAutoSaveProps {
    debounce: number
    form: FormRenderProps
    save: (difference) => any
}

class FormAutoSave extends Component<FormAutoSaveProps, FormAutoSaveState> {
    constructor(props) {
        super(props)
        this.state = {values: props.form.initialValues, submitting: false}
    }

    timeout: Timer
    promise: Promise<any>

    componentWillReceiveProps(nextProps) {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(this.save, this.props.debounce)
    }

    componentWillUnmount(): void {
        // This could discard unsaved changes. Maybe force save here?
        this.save()
        clearTimeout(this.timeout)
    }

    save = async () => {
        if (this.promise) {
            await this.promise
        }
        const {form, save} = this.props
        // This diff step is totally optional
        //console.log(`form`, form);
        const {values, handleSubmit, dirtyFields} = form
        const difference = _.mapValues(
            diff.custom({
                equal: (a, b) => _.isEqual(a, b)
            }, this.state.values, values),
            v => v === undefined ? undefined : v)
        const dirtyDiff = _.pickBy(difference, (v, k) => dirtyFields[k])
        //console.log(`diff / dirtyDiff`, difference, dirtyDiff);
        if (Object.keys(dirtyDiff).length > 0) {
            // values have changed
            this.setState({submitting: true, values})
            this.promise = this.props.save(dirtyDiff)
            await this.promise;
            //await handleSubmit()
            this.promise = null;
            this.setState({submitting: false})
        }
    }

    render() {
        // This component doesn't have to render anything, but it can render
        // submitting state.
        return (
            this.state.submitting &&
            <Container> <Spinner size={12} intent={Intent.SUCCESS}/><span>Sincronitzant...</span></Container>
        )
    }
}

export default FormAutoSave;

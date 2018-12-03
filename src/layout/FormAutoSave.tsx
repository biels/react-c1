import React, {Component} from 'react';
import styled from "styled-components";
import diff from 'object-diff'
import {Intent, Spinner} from "@blueprintjs/core";
import Timer = NodeJS.Timer;
import * as _ from "lodash";

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
    values
    save: (difference) => any
}

class FormAutoSave extends Component<FormAutoSaveProps, FormAutoSaveState> {
    constructor(props) {
        super(props)
        this.state = {values: props.values, submitting: false}
    }

    timeout: Timer
    promise: Promise<any>

    componentWillReceiveProps(nextProps) {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(this.save, this.props.debounce)
    }

    save = async () => {
        if (this.promise) {
            await this.promise
        }
        const {values, save} = this.props
        // This diff step is totally optional
        const difference = _.mapValues(diff(this.state.values, values), v => v === undefined ? null : v)
        console.log(`D`, difference);
        if (Object.keys(difference).length > 0) {
            // values have changed
            this.setState({submitting: true, values})
            this.promise = this.props.save(difference)
            console.log(`Submitting`, difference);
            await this.promise;
            console.log(`Submitted`);
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

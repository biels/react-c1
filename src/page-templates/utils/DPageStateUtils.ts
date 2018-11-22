import {Component} from "react";
// Deprecated
export type SetState = (state) => void
interface State {

}
interface StateProps {
    state: State
    setState: SetState
}
export function redirectState<P extends StateProps, S>(thisComponent: Component<P, S>, innerStatePropName: keyof P['state']) {
    return {
        state: thisComponent.props.state[innerStatePropName]
    }
}

export function handleSetSate<P extends StateProps, S>(thisComponent: Component<P, S>, innerStatePropName: keyof P['state']) {
    return function (pageStateAssign) {
        const stateElement = thisComponent.props.state[innerStatePropName] as any;
        const innerState = {...stateElement, ...pageStateAssign}
        thisComponent.props.setState({...thisComponent.props.state as any, [innerStatePropName]: innerState})
    }
}
export function handleTopSetState<P extends Object, S>(thisComponent: Component<P, S>, innerStatePropName: keyof S) {
    return function (innerStateAssign) {
        const stateElement = thisComponent.state[innerStatePropName] as any;
        const innerState = {...stateElement, ...innerStateAssign}
        thisComponent.setState({...thisComponent.state as any, [innerStatePropName]: innerState})
    }
}
import React, {Component} from 'react';
import {Dialog} from "@blueprintjs/core";

export interface GenericDialogProps {
    isOpen: boolean
    onClose: () => void
    title?: any
}

class GenericDialog extends Component<GenericDialogProps> {
    render() {
        return <Dialog
            className={'full-width'}
            lazy={false}
            usePortal={true}
            title={this.props.title}
            isOpen={this.props.isOpen} onClose={this.props.onClose}>
            {this.props.children}
        </Dialog>
    }
}

export default GenericDialog;

import React, {Component, ReactNode} from 'react';
import {Dialog, Classes, Button, AnchorButton, Intent, Icon, IconName} from "@blueprintjs/core";
export interface GenericDialogProps {
    isOpen: boolean
    onClose: () => void
    title?: any
    buttons?: {
        type?: 'cancel' | 'submit'
        intent?: Intent
        icon?: IconName
        onClick?: (event) => void
        text?: any
    }[]
}

class GenericDialog extends Component<GenericDialogProps> {
    render() {
        return <Dialog
            style={{width: 1000}}
            lazy={false}
            usePortal={true}
            title={this.props.title}
            isOpen={this.props.isOpen} onClose={this.props.onClose}>
            <div className={Classes.DIALOG_BODY}>
                {this.props.children}
            </div>
            {this.props.buttons && <div className={Classes.DIALOG_FOOTER}>

                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            {/*<Button onClick={this.props.onClose}>Cancel</Button>*/}
                        {this.props.buttons.map(b => <Button key={b.text.toString()} onClick={b.onClick} intent={b.intent} icon={b.icon}>{b.text}</Button>)}
                    </div>
            </div>}
        </Dialog>
    }
}

export default GenericDialog;

import React, {Component} from 'react';
import styled from "styled-components";
import _ from "lodash";
import {Button, Intent} from "@blueprintjs/core";
import {Action} from "../components/PageHeader/components/ActionArea";
import Actions from "../Actions/Actions";
import {EntityRenderProps} from "react-entity-plane";
import {FormRenderProps} from "react-final-form";
import EntityActions from "../../layout/EntityActions";


const Container = styled.div`
    line-height: 100%;
    border: 1px solid gray;
    padding: 8px;
`
const HeaderContainer = styled.div`
    display: grid;
    grid-template-columns: auto 1fr auto;
    h3 {
      margin: 8px 0px 16px;
    }
`;
const ActionsContainer = styled.div`
    align-items: center;
    grid-gap: 4px;
`
const ContentContainer = styled.div`

`

/*[{
                    name: 'edit',
                    intent: Intent.PRIMARY,
                    text: 'editar',
                    iconName: 'document',
                    callback: () => null
                }]*/

export interface PageSectionProps {
    title: string
    actions?: Action[]
    disableActions?: string[]
    minimalActions?: boolean
    verticalActions?: boolean
    entity?: EntityRenderProps
    form?: FormRenderProps
}

class PageSection extends Component<PageSectionProps> {
    render() {
        return <Container>
            <HeaderContainer>
                <h3>{this.props.title}</h3>
                <div/>
                {/*<Actions actions={this.props.actions} minimal={this.props.minimalActions} noText hideDisabled/>*/}
                {this.props.entity && <EntityActions
                  entity={this.props.entity}
                  form={this.props.form}
                  actions={this.props.actions}
                  disable={this.props.disableActions}
                  hideDisabled
                />}
            </HeaderContainer>
            <ContentContainer>
                {this.props.children}
            </ContentContainer>
        </Container>
    }
}

export default PageSection;

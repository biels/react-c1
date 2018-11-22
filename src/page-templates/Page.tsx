import React, { Component, ReactNode, SyntheticEvent } from 'react';
import styled from 'styled-components';
import PageHeader, { PageHeaderProps } from './components/PageHeader/PageHeader';


import PageContextSpy from 'react-navigation-plane/lib/PageContext/PageContextSpy';
import InstanceTitle from 'react-navigation-plane/lib/utils/InstanceTitle';
import { EntityContextProvider } from 'react-entity-plane/lib/EntityContext';
import { EntityPlaneInfo } from 'react-entity-plane/lib/types/EntityPlaneInfo';
import ErrorBoundary from './ErrorBoundary';
import { ProvidedPageContext } from 'react-navigation-plane/lib/PageContext/PageContext';

const Container = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    //overflow: hidden;
    //min-height: 0px;
`;

export interface BodyRenderArgs {
    pageContext: ProvidedPageContext
}

export interface BasicPageProps {
    title: PageHeaderProps['title'],
    subtitle?: PageHeaderProps['subtitle']
    actions: PageHeaderProps['actions']
    renderCustomHeaderArea: PageHeaderProps['renderCustomHeaderArea']
    enableBack?: boolean
    renderBody: (args: BodyRenderArgs) => JSX.Element
    caption?: (title: ReactNode, subtitle: ReactNode) => JSX.Element
    entityPlane?: EntityPlaneInfo
}

class Page extends Component<BasicPageProps> {
    static defaultProps: Partial<BasicPageProps> = {
        caption: (title: ReactNode, subtitle: ReactNode) => {
            if (!subtitle) return <div>{title}</div>;
            return <div>{title} - {subtitle}</div>;
        },
        renderCustomHeaderArea: () => null,
        actions: []
    };
    state = { hasError: false };

    handleBackClick(e: SyntheticEvent) {
        // Navigation go back
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        console.log('Error: ', error, info);
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) return <div>Something went wrong in page</div>;
        return <ErrorBoundary>
            <PageContextSpy>
                {(pageContext) => {
                    return <EntityContextProvider entityPlaneInfo={this.props.entityPlane}
                                                  rootEntityId={pageContext.args.entityId}>
                        <Container onClick={this.handleBackClick}>
                            <InstanceTitle title={this.props.caption(this.props.title, this.props.subtitle)}/>
                            <PageHeader title={this.props.title} subtitle={this.props.subtitle}
                                        actions={this.props.actions}
                                        renderCustomHeaderArea={this.props.renderCustomHeaderArea}/>
                            <ErrorBoundary>
                                {this.props.renderBody({pageContext: pageContext})}
                            </ErrorBoundary>
                        </Container>
                    </EntityContextProvider>;
                }}
            </PageContextSpy>
        </ErrorBoundary>;
    }
}

export default Page;

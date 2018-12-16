import React, {Component, ReactNode} from 'react';
import styled from 'styled-components';
import PageHeader, {PageHeaderProps} from './components/PageHeader/PageHeader';


import ErrorBoundary from './ErrorBoundary';
import {getKeyComboString} from "@blueprintjs/core";
import * as _ from 'lodash';
import {EntityPlaneInfo, EntityContextProvider} from 'react-entity-plane';
import {ProvidedPageContext, PageContextSpy, InstanceTitle} from 'react-navigation-plane';
import {ProvidedNavigationContext} from 'react-navigation-plane/src/NavigationContext/NavigationContext';

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
    state = {hasError: false};

    handleMouseDown = (back: ProvidedNavigationContext['back']) => (e: MouseEvent) => {
        // Navigation go back
        if (_.isFunction(back) && e.button === 3) {
            e.preventDefault();
            e.stopPropagation();
            history.pushState(null, document.title, location.href);
            back()
        }
    }
    handleKeyDown = (back) => (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Navigation go back
        const combo = getKeyComboString(e.nativeEvent as KeyboardEvent);
        if(_.isFunction(back) && combo === 'alt + left'){
            e.preventDefault();
            e.stopPropagation();
            history.pushState(null, document.title, location.href);
            back()
        }
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({hasError: true});
        console.log('Error: ', error, info);
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) return <div>Something went wrong in page</div>;
        return <ErrorBoundary>
            <PageContextSpy>
                {(pageContext: ProvidedPageContext) => {
                    return <EntityContextProvider entityPlaneInfo={this.props.entityPlane}
                                                  rootEntityId={pageContext.args.entityId}>
                        <Container onMouseDown={this.handleMouseDown(pageContext.back)} tabIndex="0" onKeyDown={this.handleKeyDown(pageContext.back)}>
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

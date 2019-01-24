import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import TabBar, { TabBarProps } from './components/TabBar';
import Page, { BasicPageProps } from '../Page';
import { Tab } from './TabsPage';
import {PageHeaderProps} from "../components/PageHeader/PageHeader";
import {DefaultCustomHeaderAreaProps} from "../components/PageHeader/components/DefaultCustomHeaderArea";

const Container = styled.div`
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
`

export interface Tab {
    name: string
    displayName?: string
    iconName?: string
    render: (props) => JSX.Element
}

export interface TabBarRenderProps {
    tabOptions: TabBarProps['tabOptions']
    selectedTabIndex: number
    onSelectTab: Function
}

export interface TabsPageState {
    selectedTabIndex: number
}

export interface TabsPageProps {
    renderTabBar?: (props: TabBarRenderProps) => JSX.Element
    route: string[]
    onChangeRoute: (route: string) => void
    // renderBody: (props) => JSX.Element
    renderCustomHeaderArea?: BasicPageProps['renderCustomHeaderArea']
    tabs: Tab[]
    title: BasicPageProps['title']
    subtitle?: BasicPageProps['subtitle']
    actions?: BasicPageProps['actions']
    attributes?: BasicPageProps['attributes']
    entityPlane?: BasicPageProps['entityPlane']
    caption?: BasicPageProps['caption']
    renderWithEntity?: BasicPageProps['renderWithEntity']
    renderTagsArea?: PageHeaderProps['renderTagsArea']
    renderAttributesArea?: PageHeaderProps['renderAttributesArea']
    renderActionsArea?: PageHeaderProps['renderActionsArea']
}

class TabsPage extends Component<TabsPageProps, TabsPageState> {
    static defaultProps: Partial<TabsPageProps> = {
        renderTabBar: props => <TabBar {...props}/>
    }
    state = {
        selectedTabIndex: 0
    }
    render() {
        return <Page
            entityPlane={this.props.entityPlane}
            title={this.props.title}
            subtitle={this.props.subtitle}
            caption={this.props.caption}
            renderCustomHeaderArea={this.props.renderCustomHeaderArea}
            actions={this.props.actions}
            renderWithEntity={this.props.renderWithEntity}
            renderActionsArea={this.props.renderActionsArea}
            renderAttributesArea={this.props.renderAttributesArea}
            renderTagsArea={this.props.renderTagsArea}
            attributes={this.props.attributes}
            renderBody={({pageContext}) => {
                const handleSelectTab = (newIndex) => {
                    // this.setState({selectedTabIndex: newIndex})
                    // use
                    pageContext.setPageState({route: [this.props.tabs[newIndex].name]})
                }
                let selectedTabIndex = _.findIndex(this.props.tabs,
                    (tab: Tab) => tab.name === _.get(pageContext.state.route, 0))
                if(selectedTabIndex === -1){
                    selectedTabIndex = 0;
                }
                const renderedArea = () => {
                    const renderedTabs = this.props.tabs.map(tab => {
                        return tab.render({})
                    })
                    // return <Switch views={renderedTabs} selected={(selectedTabIndex)}/>
                    return renderedTabs[selectedTabIndex]
                    // this.props.tabs[selectedTabIndex || 0].render({})
                }
                return <Container>
                    {this.props.renderTabBar({
                        tabOptions: this.props.tabs.map((t) => ({displayName: t.displayName, inconName: t.iconName})),
                        onSelectTab: handleSelectTab,
                        selectedTabIndex: selectedTabIndex
                    })}
                    {renderedArea()}
                </Container>
            }}
        />
    }
}

export default TabsPage;

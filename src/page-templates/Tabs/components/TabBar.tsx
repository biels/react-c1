import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

const Container = styled.div`
    display: grid;
    justify-content: left;
    grid-auto-flow: column;
    grid-auto-columns: auto 1px;
    grid-gap: 3px;
    height: auto;
    padding: 2px 8px;
    background-color: white;
    border-top: 1px solid lightblue;
`
const TabButton = styled.div<{ selected: boolean }>`
    display: flex;
    justify-content: center;
    padding: 4px 5px;
    border-radius: 3px;
    color: #5990b6;
    cursor:pointer;
    
    :active{
      background-color: #5990b6;
      color: white;
    }
    ${({selected}) => selected ? `
      background-color: #048FBF;
      color: white;
    ` : `
        :hover{
          background-color: lightblue;
        }
    `}
`
const TabSeparator = styled.div`
    width: 2px;
    transform: scaleX(0.55);
    height: 100%;
    background: linear-gradient(white, lightblue, white);
`

export interface TabOption {
    displayName?: string
    iconName?: string
}

export interface TabBarProps {
    tabOptions: TabOption[]
    selectedTabIndex: number
    onSelectTab: Function
}

class TabBar extends Component<TabBarProps> {

    render() {
        const selectedTab = this.props.selectedTabIndex;
        const selectTab = this.props.onSelectTab;
        return <Container>
            {_.flatMap(this.props.tabOptions,
                (option, i, a) => {
                    let tabButton = (<TabButton key={i * 2} onClick={() => selectTab(i)} selected={(selectedTab || 0) === i}>
                        {option.displayName || 'Unnamed'}
                    </TabButton>);
                    return (a.length - 1 !== i ? [tabButton, <TabSeparator key={(i*2)+1}/>] : [tabButton])
                })}
        </Container>
    }
}

export default TabBar;

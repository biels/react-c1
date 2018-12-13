import React, {Component} from 'react';
import styled from "styled-components";
import _ from "lodash";

const Name = styled.div`
    text-overflow: ellipsis;
`
const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    background: #f5f8fa;
    border-radius: 3px;
    font-weight: bold;
    padding: 4px 0px;
`

export interface PlaceholderProps {
    name: string
}

class Placeholder extends Component<PlaceholderProps> {
    render() {
        return <Container>
            <Name>{`<${this.props.name}/>`}</Name>
        </Container>
    }
}

export default Placeholder;

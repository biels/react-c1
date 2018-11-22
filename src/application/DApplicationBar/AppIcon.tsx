import React, {Component} from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: grid;
    line-height: 0;
    color: white;
    //text-shadow: 3px 3px black;
    font-size: 36px;
    font-family: Arial, sans-serif;
    align-items: center;
    justify-content: center;
`


class AppIcon extends Component {
    render() {
        return (
            <Container>
                F
            </Container>
        );
    }
}

export default AppIcon;
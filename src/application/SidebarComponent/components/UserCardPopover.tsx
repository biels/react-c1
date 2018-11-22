import React from 'react';
import {Button, Intent} from '@blueprintjs/core';
import styled from 'styled-components'


const Container = styled.div`
   width: 320px;
   height: 120px + 12*2px;
   padding: 12px;
   display: grid;
   grid-template-columns: auto 1fr;
   grid-template-rows: auto auto;
   grid-template-areas:
   "picture details"
   "picture button";
   grid-gap: 16px;
`
const PictureArea = styled.div`
    grid-area: Picture;
    background-image: url('./images/Sarah-User.png');
    background-size: contain;
    //background-color: rgba(255, 223, 202, 0.082);
    //border: 3px dashed rgb(23, 69, 221);
    border-radius: 100px;
    height: 120px;
    width: 120px;
`
const DetailsArea = styled.div`
    grid-area: Details;
    display: grid;
    grid-template-rows: auto auto 1fr;
    grid-template-areas:
    "name"
    "account"
    ".";
`
const NameArea = styled.div`
    grid-area: Name;
    text-transform: uppercase;
    font-weight: bold
`

const AccountArea = styled.div`
    grid-area: Account;
        font-size: 11px;
    color: gray;

`
const RoleArea = styled.div`
    grid-area: Role;
    color: gray;
`
const ButtonArea = styled.div`
    grid-area: Button;
`



export default class UserCardPopover extends React.PureComponent {
  render() {
    return (
      <Container>
        <PictureArea/>
        <DetailsArea>
          <NameArea>
            Dra. Sarah Pérez
          </NameArea>
          <RoleArea>
            Hospital Universitario Gregorio Marañón
          </RoleArea>
          <AccountArea>
            sara.perez@hospital.com
          </AccountArea>

        </DetailsArea>
        <ButtonArea>
          <Button icon={'arrow-right'} intent={Intent.PRIMARY}>
            Ir a mi perfil
          </Button>
        </ButtonArea>
      </Container>
    );
  }
}

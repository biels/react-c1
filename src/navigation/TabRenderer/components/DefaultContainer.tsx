import React, {Component} from 'react';
import styled from "styled-components";
import _ from "lodash";
import {SortableContainer} from "react-sortable-hoc";

const DefaultContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: flex-end;
    padding-right: 8px;
    background-color: #ced9e0;
    > div {
      margin-left: 6px;
    }
`

export default DefaultContainer;

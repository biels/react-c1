import React, {Component} from 'react';
import styled from 'styled-components';
import _ from 'lodash';

const Container = styled.div`
  display: flex;
  height: 42px;
  align-items: center;
`;
const Divider = styled.div`
  height: 100%;
  width: 2px;
  transform: scaleX(0.5);
  outline: 1px solid transparent;
  background: linear-gradient(white, gray, white);
`;
const HalfDivider = styled.div`
  align-self: flex-end;
  height: 50%;
  width: 2px;
  transform: scaleX(0.5);
  background: linear-gradient(gray, white);

`;
const AttributeContainer = styled.div`
  display: flex;
  min-height: 45px;
  align-items: center;
  justify-content: center;
  margin: 4px    
`;

const AttributeNameContainer = styled.span`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 10px;
  color: #0e5a8a;
`;
const AttributeValueSectionContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    color: gray;
`;
const AttributeValueContainer = styled.div`
    
`;
const AttributeUnitContainer = styled.div`
    margin-left: 1.5px;
`;
const AttributeInnerDivContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ButtonGroupContainer = styled.div`
  padding-left: 4px;
  display: flex;
  flex-direction: row;
`;
const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; 
`;
const TextInformationContainer = styled.div`
  border: 3px solid red;
  color: red;
  font-weight: 700;
  margin-left: 5px;
  padding: 0 5px;
  border-radius: 3px;

`;

export interface AttributeProps {
    name
    value
    unit?
}

const Attribute = (props: AttributeProps) => {
    const unitPresent = props.unit !== undefined;
    return <AttributeContainer>
        <AttributeInnerDivContainer>
            <AttributeNameContainer>
                {props.name}
            </AttributeNameContainer>
            <AttributeValueSectionContainer>
                <AttributeValueContainer>
                    {props.value || '---'}
                </AttributeValueContainer>
                {unitPresent && <AttributeUnitContainer>{props.unit}</AttributeUnitContainer>}
            </AttributeValueSectionContainer>
        </AttributeInnerDivContainer>
    </AttributeContainer>;
};
export type AttributeGroup = AttributeDescription[]

export interface AttributeDescription {
    name
    value
    unit?
}

export type AttributesProp = (AttributeGroup | AttributeDescription)[];

export interface AttributeDisplayProps {
    attributes: AttributesProp
}

const intersperse = (a, e) => a.reduce((p, c, i) => (p[2 * i] = c, p), new Array(2 * a.length - 1).fill(e));

class AttributeDisplay extends Component<AttributeDisplayProps> {
    render() {
        let attributes = this.props.attributes;
        if (attributes == null) return null;
        attributes = attributes
            .filter(a => a != null)
            .filter(a => _.isArray(a) || a.value != null)
        const mapAttribute = (a: AttributeDescription, i) => <Attribute key={a.name + i} {...a}/>;
        const mapGroup = (group: AttributeGroup) => {
            return intersperse(group
                .map(mapAttribute), <HalfDivider/>)
        };
        let items = intersperse(attributes
            .map((attribute, i) => {
                if (_.isArray(attribute)) {
                    return mapGroup(attribute);
                } else {
                    return mapAttribute(attribute, i);
                }
            }), <Divider/>);
        return <Container>
            {items}
        </Container>;
    }
}

export default AttributeDisplay;

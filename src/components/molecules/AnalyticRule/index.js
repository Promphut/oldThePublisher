import React from 'react'
import styled from 'styled-components'

const RuleContainer = styled.div `
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
`

const RuleIndicator = styled.div `
  border-radius: 50%;
  width: 15px;
  height: 15px;
  margin-right: 10px;
  background-color: ${props => props.status};
`

const RuleText = styled.span `
  margin-left: 10px;
`

export default class AnalyticRule extends React.Component {
  // Status to color convertor
  ruleColourSelector(status) {
    // Colour Rules
    // Status = 0 => Danger  : rgb(235,87,87)
    // Status = 1 => Clear   : rgb(39,174,96)
    // Status = 2 => Warning : rgb(242,153,74)

    if (status === 0) return 'rgb(235,87,87)'
    else if (status === 1) return 'rgb(242,153,74)'
    return 'rgb(39,174,96)'
  }

  render() {
    return (
      <RuleContainer>
        <RuleIndicator status={this.ruleColourSelector(this.props.status)} />
        <RuleText>{this.props.text}</RuleText>
      </RuleContainer>
    )
  }
}

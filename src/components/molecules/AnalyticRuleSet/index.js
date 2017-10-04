import React from 'react'
import styled from 'styled-components'

import AnalyticRule from '../AnalyticRule'

const RuleSetContainer = styled.div `
  margin-top: 20px;
`

export default class AnalyticRuleSet extends React.Component {
  render() {
    var rules = [];

    for (var rule of this.props.rules)
      rules.push(<AnalyticRule key={rule.text} status={rule.status} text={rule.text} />)

    return (
      <RuleSetContainer>
        {rules}
      </RuleSetContainer>
    )
  }
}

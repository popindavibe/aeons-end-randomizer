import React from 'react'

import config from '../../../config'
import { Mage } from '../../../types'

import ShowDetailsButton from '../../ShowDetailsButton'

import Wrapper from './Wrapper'
import Card from './Card'
import CardContent from './CardContent'
import CardTypeIcon from './CardTypeIcon'
import ExpansionName from './ExpansionName'
import Name from './Name'

type Props = {
  mage: Mage
  playerNumber: number
  showMageDetails: Function // FIXME signature
}

const MageTile = React.memo(
  ({ mage, playerNumber, showMageDetails }: Props) => {
    return (
      <Wrapper item xs={6} md={3}>
        <Card playerNumber={playerNumber}>
          <CardContent>
            <ExpansionName color="textSecondary">
              {/* FIXME remove direct connection to config and use store instead! */}
              {config.DATA[mage.expansion].name}
            </ExpansionName>
            <Name variant="h6" component="h2">
              {mage.name}
            </Name>
          </CardContent>
          <CardTypeIcon type="mage" />
          <ShowDetailsButton
            onClick={() => showMageDetails(mage.id, playerNumber)}
          />
        </Card>
      </Wrapper>
    )
  }
)

MageTile.displayName = 'MageTile'

export default MageTile
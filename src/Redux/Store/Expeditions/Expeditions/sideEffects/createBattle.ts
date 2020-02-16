import { RootState, selectors } from 'Redux/Store'
import * as types from 'types'
import {
  getRandomEntity,
  createIdList,
  createArrayWithDefaultValues,
} from 'Redux/helpers'

// Because we always add these cards to an existing array inside our expedition in our store,
// the count of newly added cards decreases by tier.
// If we ever have a variant, that starts higher than tier 2 we have to
// incorporate changes to roll the whole amount of cards per tier!
const getUpgradedBasicNemesisIdsByBattleTier = ({
  availableTier1Ids,
  availableTier2Ids,
  availableTier3Ids,
  battleTier,
  getEntity,
}: {
  availableTier1Ids: string[]
  availableTier2Ids: string[]
  availableTier3Ids: string[]
  battleTier: 1 | 2 | 3 | 4
  getEntity: <E>(list: Array<E>) => E
}) => {
  switch (battleTier) {
    case 1: {
      return [] // No upgraded cards are added on tier 1
    }

    case 2: {
      const tier1Ids = createIdList(
        availableTier1Ids,
        createArrayWithDefaultValues(1, 'EMPTY'),
        getEntity
      ).result
      const tier2Ids = createIdList(
        availableTier2Ids,
        createArrayWithDefaultValues(3, 'EMPTY'),
        getEntity
      ).result
      const tier3Ids = createIdList(
        availableTier3Ids,
        createArrayWithDefaultValues(3, 'EMPTY'),
        getEntity
      ).result

      return [...tier1Ids, ...tier2Ids, ...tier3Ids]
    }

    case 3:
    case 4: {
      const tier1Ids = createIdList(
        availableTier1Ids,
        createArrayWithDefaultValues(1, 'EMPTY'),
        getEntity
      ).result
      const tier2Ids = createIdList(
        availableTier2Ids,
        createArrayWithDefaultValues(1, 'EMPTY'),
        getEntity
      ).result
      const tier3Ids = createIdList(
        availableTier3Ids,
        createArrayWithDefaultValues(2, 'EMPTY'),
        getEntity
      ).result

      return [...tier1Ids, ...tier2Ids, ...tier3Ids]
    }

    default: {
      return [] // Should never occur!
    }
  }
}

const rollNewUpgradedNemesisCards = (
  availableUpgradedBasicNemesisCards: types.UpgradedBasicNemesisCard[],
  previousUpgradedBasicNemesisCards: string[],
  nemesisTier: 1 | 2 | 3 | 4,
  getEntity: <E>(list: Array<E>) => E
) => {
  const upgradedCardsWithoutPreviousCards = availableUpgradedBasicNemesisCards.filter(
    upgradedCard => !previousUpgradedBasicNemesisCards.includes(upgradedCard.id)
  )

  const tier1AvailableUpgradedNemesisIds = upgradedCardsWithoutPreviousCards
    .filter(card => card.tier === 1)
    .map(card => card.id)
  const tier2AvailableUpgradedNemesisIds = upgradedCardsWithoutPreviousCards
    .filter(card => card.tier === 2)
    .map(card => card.id)
  const tier3AvailableUpgradedNemesisIds = upgradedCardsWithoutPreviousCards
    .filter(card => card.tier === 3)
    .map(card => card.id)

  const upgradedBasicNemesisCardIds = getUpgradedBasicNemesisIdsByBattleTier({
    battleTier: nemesisTier,
    availableTier1Ids: tier1AvailableUpgradedNemesisIds,
    availableTier2Ids: tier2AvailableUpgradedNemesisIds,
    availableTier3Ids: tier3AvailableUpgradedNemesisIds,
    getEntity,
  })

  return [...previousUpgradedBasicNemesisCards, ...upgradedBasicNemesisCardIds]
}

const rollNemesisId = (
  state: RootState,
  expedition: types.Expedition,
  battle: types.Battle
): string => {
  const availableNemesisIds = expedition.settingsSnapshot.availableNemesisIds
  const availableNemeses = availableNemesisIds.map(id => {
    return selectors.Settings.Expansions.SelectedNemeses.getSelectedNemesesState(
      state
    ).nemeses[id]
  })
  const previousNemeses = expedition.battles.reduce((acc: string[], battle) => {
    if (battle.nemesisId) {
      return [...acc, battle.nemesisId]
    }

    return acc
  }, [])

  const nemesisIds = availableNemeses
    .filter(nemesis => nemesis.expeditionRating === battle.nemesisTier.tier)
    .map(nemesis => nemesis.id)
    .filter(nemesisId => !previousNemeses.includes(nemesisId))

  const nemesisId = createIdList(
    nemesisIds,
    createArrayWithDefaultValues(1, 'EMPTY'),
    availableEntities => getRandomEntity(availableEntities, expedition.seed)
  ).result[0]

  return nemesisId
}

export const createBattle = (
  getState: () => RootState,
  battle: types.Battle
) => {
  const state = getState()

  const expedition = selectors.Expeditions.Expeditions.getExpeditionById(
    state,
    { expeditionId: battle.expeditionId }
  )

  const nemesisId = rollNemesisId(state, expedition, battle)

  const previousUpgradedBasicNemesisCards = expedition.upgradedBasicNemesisCards
  const availableUpgradedBasicNemesisCards = selectors.Settings.Expansions.getUpgradedBasicNemesisCardsForSelectedExpansions(
    state
  )

  const upgradedBasicNemesisCardIds = battle.nemesisTier.isNewTier
    ? rollNewUpgradedNemesisCards(
        availableUpgradedBasicNemesisCards,
        previousUpgradedBasicNemesisCards,
        battle.nemesisTier.tier,
        availableEntities => getRandomEntity(availableEntities, expedition.seed)
      )
    : previousUpgradedBasicNemesisCards

  return {
    battle: { ...battle, nemesisId, status: 'before_battle' },
    upgradedBasicNemesisCardIds,
  }
}

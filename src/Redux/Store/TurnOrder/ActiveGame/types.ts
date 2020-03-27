import { ActionsUnion } from '@martin_hotell/rex-tils'

import * as types from 'types'

import { actions } from './actions'

export type State = {
  deck: Array<types.ITurnOrderCard>
  discard: Array<types.ITurnOrderCard>
  started: boolean
}

export enum ActionTypes {
  INIT = 'TurnOrder/ActiveGame/INIT',
  DRAW = 'TurnOrder/ActiveGame/DRAW',
  NEW_ROUND = 'TurnOrder/ActiveGame/NEW_ROUND',
  ADD_TO_TOP = 'TurnOrder/ActiveGame/ADD_TO_TOP',
  ADD_TO_BOTTOM = 'TurnOrder/ActiveGame/ADD_TO_BOTTOM',
  SHUFFLE_INTO_DECK = 'TurnOrder/ActiveGame/SHUFFLE_INTO_DECK',
  SET_TURNORDER_TO_DB_SUCCESS = 'TurnOrder/ActiveGame/SET_TURNORDER_TO_DB_SUCCESS',
  SET_TURNORDER_TO_DB_FAILURE = 'TurnOrder/ActiveGame/SET_TURNORDER_TO_DB_FAILURE',
  START_GAME = 'TurnOrder/ActiveGame/START_GAME',
  RESET_GAME = 'TurnOrder/ActiveGame/RESET_GAME',
  FETCH_FROM_DB = 'TurnOrder/ActiveGame/FETCH_FROM_DB',
  FETCH_FROM_DB_SUCCESS = 'TurnOrder/ActiveGame/FETCH_FROM_DB_SUCCESS',
  FETCH_FROM_DB_FAILURE = 'TurnOrder/ActiveGame/FETCH_FROM_DB_FAILURE',
}

export type Action = ActionsUnion<typeof actions>
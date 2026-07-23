/* eslint-disable no-param-reassign */
import { useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useCallback } from 'react'
import { $confirmations, $updateBtn } from '../../../GlobalStates/GlobalStates'
import type { BoxShadow, ConfirmationStyles, MsgConfig } from '../Types/confirmMessage.types'
import { DEFAULT_BOX_SHADOW } from './messageStaticData'

/**
 * Centralizes all `$confirmations` mutations for a single success message.
 * Every update also flags the builder as unsaved.
 */
export default function useMessageConfig(id: number) {
  const setAllConf = useSetAtom($confirmations)
  const setUpdateBtn = useSetAtom($updateBtn)

  const markUnsaved = useCallback(() => {
    setUpdateBtn((prevState: any) => ({ ...prevState, unsaved: true }))
  }, [setUpdateBtn])

  const mutateMsg = useCallback((recipe: (msgDraft: any) => void) => {
    setAllConf((prevConf: any) => create(prevConf, (draft: any) => {
      recipe(draft.type.successMsg[id])
    }))
    markUnsaved()
  }, [id, setAllConf, markUnsaved])

  const updateMsg = useCallback((msg: string) => {
    mutateMsg(msgDraft => { msgDraft.msg = msg })
  }, [mutateMsg])

  const updateConfig = useCallback(<K extends keyof MsgConfig>(key: K, value: MsgConfig[K]) => {
    mutateMsg(msgDraft => { msgDraft.config[key] = value })
  }, [mutateMsg])

  const toggleAutoHide = useCallback(() => {
    mutateMsg(msgDraft => { msgDraft.config.autoHide = !msgDraft.config.autoHide })
  }, [mutateMsg])

  const updateStyle = useCallback((name: keyof ConfirmationStyles | string, value: string) => {
    mutateMsg(msgDraft => { msgDraft.config.styles[name] = value })
  }, [mutateMsg])

  const updateShadow = useCallback((index: number, name: keyof BoxShadow | string, value: string) => {
    mutateMsg(msgDraft => { msgDraft.config.styles.boxShadow[index][name] = value })
  }, [mutateMsg])

  const addShadow = useCallback(() => {
    mutateMsg(msgDraft => { msgDraft.config.styles.boxShadow.push({ ...DEFAULT_BOX_SHADOW }) })
  }, [mutateMsg])

  const deleteShadow = useCallback((index: number) => {
    mutateMsg(msgDraft => { msgDraft.config.styles.boxShadow.splice(index, 1) })
  }, [mutateMsg])

  return {
    updateMsg,
    updateConfig,
    toggleAutoHide,
    updateStyle,
    updateShadow,
    addShadow,
    deleteShadow,
  }
}

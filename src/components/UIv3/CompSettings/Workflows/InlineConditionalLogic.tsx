import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { Fragment } from 'react/jsx-runtime'
import { $proModal, $updateBtn, $workflows } from '../../../../GlobalStates/GlobalStates'
import ChevronDownIcn from '../../../../Icons/ChevronDownIcn'
import CloseIcn from '../../../../Icons/CloseIcn'
import bitsFetch from '../../../../Utils/bitsFetch'
import { IS_PRO } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import { defaultInlineConditions } from '../../../../Utils/StaticData/form-templates/templateProvider'
import proHelperData from '../../../../Utils/StaticData/proHelperData'
import Button from '../../../Utilities/Button'
import MtSelect from '../../../Utilities/MtSelect'
import ProBadge from '../../../Utilities/ProBadge'
import SingleToggle from '../../../Utilities/SingleToggle'
import WorkflowLogicSection from '../../../Workflows/WorkflowLogicSection'
interface EffectLabels {
  show: string
  hide: string
}

interface InlineConditionalLogicProps {
  action: string
  targetId: string | number
  effectLabels?: EffectLabels
  title?: string
}

export async function removeInlineConditionalWorkflow(
  action: string,
  targetId: string | number,
  formID: string | number,
  workflows: any[],
  setWorkflows: (updater: any) => void,
  markUnsaved: () => void,
): Promise<boolean> {
  const idx = workflows.findIndex((wf: any) =>
    wf?.info?.type === 'advanced'
    && wf?.info?.action === action
    && String(wf?.info?.targetId) === String(targetId),
  )
  if (idx === -1) return true
  const wfId = workflows[idx].id
  if (wfId) {
    const res = await bitsFetch({ formID, id: wfId }, 'bitforms_delete_workflow')
    if (!res?.success) return false
  }
  setWorkflows((prev: any[]) => create(prev, (draft: any[]) => { draft.splice(idx, 1) }))
  markUnsaved()
  return true
}

export default function InlineConditionalLogic({
  action,
  targetId,
  effectLabels = { show: __('Show'), hide: __('Don\'t Show') },
  title = '',
}: InlineConditionalLogicProps) {
  const { css } = useFela()
  const [workflows, setWorkflows] = useAtom($workflows)
  const setProModal = useSetAtom($proModal)
  const setUpdateBtn = useSetAtom($updateBtn)
  const [collapsed, setCollapsed] = useState(false)

  const matchRow = (wf: any) => wf?.info?.type === 'advanced'
    && wf?.info?.action === action
    && String(wf?.info?.targetId) === String(targetId)

  const workflowIndex = workflows.findIndex(matchRow)
  const currentRow: any = workflowIndex !== -1 ? workflows[workflowIndex] : null
  const isEnabled = !!currentRow?.status
  const markUnsaved = () => setUpdateBtn((prev: any) => ({ ...prev, unsaved: true }))

  const toggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...((proHelperData as Record<string, any>).advancedConditionalLogic || {}) })
      return
    }
    if (currentRow) {
      setWorkflows((prev: any) => create(prev, (draft: any) => {
        const i = draft.findIndex(matchRow)
        if (i === -1) return
        draft[i].status = e.target.checked ? 1 : 0
      }))
    } else {
      setWorkflows((prev: any) => create(prev, (draft: any) => {
        draft.push({
          title: title || `${__('Advanced Logic')} - ${action}`,
          action_type: 'onsubmit',
          action_run: 'create_edit',
          action_behaviour: 'cond',
          info: { action, targetId: String(targetId), type: 'advanced', effect: 'show' },
          conditions: defaultInlineConditions(),
          status: 1,
        })
      }))
    }
    markUnsaved()
  }

  const changeEffect = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...((proHelperData as Record<string, any>).advancedConditionalLogic || {}) })
      return
    }
    setWorkflows((prev: any) => create(prev, (draft: any) => {
      const i = draft.findIndex(matchRow)
      if (i === -1) return
      draft[i].info.effect = value
    }))
    markUnsaved()
  }

  const changeActionRun = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
    if (!IS_PRO) {
      setProModal({ show: true, ...((proHelperData as Record<string, any>).advancedConditionalLogic || {}) })
      return
    }
    setWorkflows((prev: any) => create(prev, (draft: any) => {
      const i = draft.findIndex(matchRow)
      if (i === -1) return
      draft[i].action_run = value
    }))
    markUnsaved()
  }

  const addLogic = (operator = 'and') => {
    if (!IS_PRO) {
      setProModal({ show: true, ...((proHelperData as Record<string, any>).advancedConditionalLogic || {}) })
      return
    }
    setWorkflows((prev: any) => create(prev, (draft: any) => {
      const i = draft.findIndex(matchRow)
      if (i === -1) return
      draft[i].conditions[0].logics.push(operator, { field: '', logic: '', val: '' })
    }))
    markUnsaved()
  }

  const effect = currentRow?.info?.effect || 'show'
  const actionRun = currentRow?.action_run || 'create_edit'

  const actionRunLabels: Record<string, string> = {
    create_edit: __('Record Create/Edit'),
    create: __('Record Create'),
    edit: __('Record Edit'),
  }
  const effectLabel = effect === 'hide' ? effectLabels.hide : effectLabels.show
  const showHints = isEnabled && currentRow && collapsed

  return (
    <div className={css(styles.container)}>
      <div
        className={css(styles.toggleRow)}
        role="button"
        tabIndex={0}
        onClick={() => isEnabled && currentRow && setCollapsed(prev => !prev)}
        onKeyDown={() => { }}
      >
        <div className={css(styles.headLeft)}>
          <span onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} role="button" tabIndex={-1}>
            <SingleToggle
              id={`adv-cl-${action}-${targetId}`}
              name={`adv-cl-${action}-${targetId}`}
              action={toggle as any}
              isChecked={isEnabled}
              className=""
              tip=""
              title=""
              disabled={false}
              isPro={false}
              proProperty=""
            />
          </span>
          <span className={css(styles.labelText)}>
            {__('Conditional Logic')}
            {!IS_PRO && <ProBadge proProperty="conditionalLogic" />}
          </span>
          {showHints && (
            <span className={css(styles.hints)}>
              {effectLabel}
              <span className={css(styles.hintSep)}>·</span>
              {actionRunLabels[actionRun]}
            </span>
          )}
        </div>
        {isEnabled && currentRow && (
          <ChevronDownIcn className="toggle-icn" size="20" stroke={2} rotate={!collapsed} />
        )}
      </div>

      {isEnabled && currentRow && !collapsed && (
        <div className={`bf-inline-conditional-logic ${css(styles.body)}`}>
          <div className={css(styles.headerRow)}>
            <div className={css(styles.row)}>
              <MtSelect value={effect} onChange={changeEffect} className={css(styles.select)} label="" style={{}}>
                <option value="show">{effectLabels.show}</option>
                <option value="hide">{effectLabels.hide}</option>
              </MtSelect>
              <span className={css(styles.helper)}>{__('this when')}</span>
            </div>
            <div className={css(styles.row)}>
              <span className={css(styles.helper)}>{__('Evaluate on')}</span>
              <MtSelect value={actionRun} onChange={changeActionRun} className={css(styles.select)} label="" style={{}}>
                <option value="create_edit">{__('Record Create/Edit')}</option>
                <option value="create">{__('Record Create')}</option>
                <option value="edit">{__('Record Edit')}</option>
              </MtSelect>
            </div>
          </div>

          <div className={css(styles.logicWrap)}>
            {currentRow.conditions?.map((condGrp: any, condGrpInd: number) => (
              <Fragment key={`adv-cl-${condGrpInd + 1}`}>
                {condGrp.cond_type !== 'else' && (
                  <WorkflowLogicSection
                    lgcGrp={currentRow}
                    lgcGrpInd={workflowIndex}
                    condGrp={condGrp}
                    condGrpInd={condGrpInd}
                    isBasic
                  />
                )}
              </Fragment>
            ))}
          </div>

          <div className={css(styles.row)}>
            <Button onClick={() => addLogic('and')} className="tertiary" id="" type="button" icn={false} disabled={false} style={{}}>
              <CloseIcn size="9" className="icn-rotate-45 mr-1" />
              {__('And')}
            </Button>
            <Button onClick={() => addLogic('or')} className="tertiary" id="" type="button" icn={false} disabled={false} style={{}}>
              <CloseIcn size="9" className="icn-rotate-45 mr-1" />
              {__('Or')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { p: 10, my: 10, b: '1px solid var(--bf-secondary-100, #e5e7eb)', brs: 'var(--bf-bdr-radius-md)' },
  toggleRow: { w: '100%', flx: 'center-between', curp: 1 },
  headLeft: { flx: 'align-center', cg: 8 },
  labelText: { fs: 14, fw: 500, cr: '#374151' },
  hints: {
    flx: 'align-center',
    cg: 6,
    ml: 4,
    fs: 12,
    fw: 500,
    cr: 'var(--dp-blue, #2563eb)',
    p: '2px 8px',
    brs: 6,
    bc: 'var(--bf-secondary-100, #eef)',
  },
  hintSep: { cr: '#9ca3af' },
  body: { mt: 14, dy: 'flex', fd: 'column', gap: 12 },
  headerRow: { w: '100%', flx: 'center-between', cg: 8, flw: 'wrap' },
  row: { flx: 'align-center', cg: 8 },
  select: { w: '160px !important' },
  helper: { fs: 13, cr: '#6b7280', fw: 500 },
  logicWrap: { dy: 'flex', fd: 'column', gap: 10 },
}

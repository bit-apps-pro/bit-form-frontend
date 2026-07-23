import { arrayMoveImmutable } from 'array-move'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { $formId, $updateBtn, $workflows } from '../../../../GlobalStates/GlobalStates'
import CloseIcn from '../../../../Icons/CloseIcn'
import CopyIcn from '../../../../Icons/CopyIcn'
import StackIcn from '../../../../Icons/StackIcn'
import TrashIcn from '../../../../Icons/TrashIcn'
import { defaultConds } from '../../../../Utils/StaticData/form-templates/templateProvider'
import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'
import ut from '../../../../styles/2.utilities'
import Accordions from '../../../Utilities/Accordions'
import Btn from '../../../Utilities/Btn'
import Button from '../../../Utilities/Button'
import ConfirmModal from '../../../Utilities/ConfirmModal'
import { DragHandle, SortableItem, SortableList } from '../../../Utilities/Sortable'
import WorkflowConditionSection from '../../../Workflows/WorkflowConditionSection'
import { actionsTitle } from '../../../Workflows/WorkflowHelpers'
import WorkflowRunner from '../../../Workflows/WorkflowRunner'

const isCentralConditionalLogic = (wf: any) => (wf?.info?.type === 'advanced' && !wf?.info?.action) || typeof wf?.info?.type === 'undefined' || wf?.info?.type === 'classic'

interface ConfMdlState {
  show: boolean
  btnTxt?: string
  btnClass?: string
  body?: string
  action?: () => void
}

export default function AdvancedConditionalLogic() {
  const formID = useAtomValue($formId)
  const [confMdl, setconfMdl] = useState<ConfMdlState>({ show: false })
  const [workflows, setWorkflows] = useAtom($workflows)
  const setUpdateBtn = useSetAtom($updateBtn)
  const { css } = useFela()
  const centralConditionalRows = workflows
    .map((lgcGrp: any, lgcGrpInd: number) => ({ lgcGrp, lgcGrpInd }))
    .filter(({ lgcGrp }: any) => isCentralConditionalLogic(lgcGrp))

  const markUnsaved = () => setUpdateBtn((prevState: any) => ({ ...prevState, unsaved: true }))

  const addLogicGrp = () => {
    setWorkflows(create(workflows, (draft: any) => {
      draft.unshift({
        title: `Action ${workflows.length + 1}`,
        action_type: 'always',
        action_run: 'create_edit',
        action_behaviour: 'cond',
        conditions: [{ ...defaultConds }],
        info: { type: 'advanced' },
        status: 1,
      })
    }))
    markUnsaved()
  }

  const delLgcGrp = (realInd: number) => {
    const wf: any = workflows[realInd]
    if (wf.id) {
      const prom = bitsFetch({ formID, id: wf.id }, 'bitforms_delete_workflow')
        .then((res: any) => {
          if (res !== undefined && res.success) {
            setWorkflows(create(workflows, (draft: any) => { draft.splice(realInd, 1) }))
          }
        })
      toast.promise(prom, { success: 'Successfully Deleted.', loading: 'Deleting...', error: 'Error occurred, Try again.' })
    } else {
      setWorkflows(create(workflows, (draft: any) => { draft.splice(realInd, 1) }))
    }
  }

  const handleLgcTitle = (e: React.ChangeEvent<HTMLInputElement>, realInd: number) => {
    setWorkflows(create(workflows, (draft: any) => { draft[realInd].title = e.target.value }))
    markUnsaved()
  }

  const toggleLgcGrpDisable = (e: React.ChangeEvent<HTMLInputElement>, realInd: number) => {
    setWorkflows(create(workflows, (draft: any) => { draft[realInd].status = e.target.checked }))
    markUnsaved()
  }

  const closeConfMdl = () => setconfMdl({ ...confMdl, show: false })

  const lgcGrpDelConf = (realInd: number) => {
    setconfMdl({
      show: true,
      btnTxt: __('Delete'),
      btnClass: '',
      body: __('Are you sure to delete this conditional logic?'),
      action: () => { delLgcGrp(realInd); closeConfMdl() },
    })
  }

  const lgcGrpCloneConf = (realInd: number) => {
    setWorkflows(create(workflows, (draft: any) => {
      const cloned = { ...draft[realInd] }
      cloned.title = `${cloned.title} (Clone-${workflows.length + 1})`
      delete cloned.id
      draft.splice(realInd + 1, 0, cloned)
    }))
    markUnsaved()
  }

  const onWorkflowSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    if (oldIndex === newIndex) return
    const realOld = centralConditionalRows[oldIndex].lgcGrpInd
    const realNew = centralConditionalRows[newIndex].lgcGrpInd
    setWorkflows(((oldWorkflows: any) => arrayMoveImmutable(oldWorkflows, realOld, realNew)) as any)
    markUnsaved()
  }

  return (
    <div className="btcd-workflow">
      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt || ''}
        btnClass={confMdl.btnClass || ''}
        body={confMdl.body || ''}
        action={confMdl.action as any}
        mainMdlCls=""
        btn2Txt=""
        btn2Action={() => { }}
        title=""
        className=""
        warning=""
      >
        {null}
      </ConfirmModal>

      <Btn onClick={addLogicGrp} variant="tertiary" className={css(ut.pMd, { fs: '14px !important' })}>
        <CloseIcn size="10" className="icn-rotate-45 mr-1" />
        {__('Add Conditional Logic')}
      </Btn>

      {centralConditionalRows.length === 0 && (
        <div className={css(ut.btcdEmpty, ut.txCenter)}>
          <StackIcn size={50} />
          {__('Empty')}
        </div>
      )}

      <SortableList onSortEnd={onWorkflowSortEnd} useDragHandle>
        {centralConditionalRows.map(({ lgcGrp, lgcGrpInd }: any, displayInd: number) => (
          <SortableItem key={`adv-wkf-${lgcGrp.id || `i${lgcGrpInd}`}`} index={displayInd}>
            <div className="workflow-grp d-flx mt-2">
              <Accordions
                customTitle={<DragHandle className="workflow-drg-handle mr-1 flx" />}
                title={lgcGrp.title}
                header={(
                  <small className="f-right txt-dp mr-4 ml-2">
                    <span className="mr-2">
                      <i className="btcd-chat-dot mr-1" />
                      {actionsTitle(lgcGrp.action_run)}
                    </span>
                    {lgcGrp.action_type !== undefined && (
                      <span className="mr-2">
                        <i className="btcd-chat-dot mr-1" />
                        {actionsTitle(lgcGrp.action_type)}
                      </span>
                    )}
                    <span>
                      <i className="btcd-chat-dot mr-1" />
                      {actionsTitle(lgcGrp.action_behaviour)}
                    </span>
                  </small>
                )}
                toggle
                checked={lgcGrp.status}
                action={(e: any) => toggleLgcGrpDisable(e, lgcGrpInd)}
                titleEditable
                onTitleChange={(e: any) => handleLgcTitle(e, lgcGrpInd)}
                notScroll
                cls="w-9"
                subtitle=""
                onExpand={() => { }}
                onCollapse={() => { }}
                tag=""
                isPro={false}
                proProperty=""
                isExpanded={false}
              >
                <WorkflowRunner lgcGrpInd={lgcGrpInd} lgcGrp={lgcGrp} />
                <WorkflowConditionSection lgcGrpInd={lgcGrpInd} lgcGrp={lgcGrp} />
              </Accordions>
              <div className="mt-2 flx flx-start">
                <Button
                  onClick={() => lgcGrpCloneConf(lgcGrpInd)}
                  icn
                  className="ml-2 sh-sm btcd-menu-btn tooltip"
                  style={{ '--tooltip-txt': '"Clone Action"' } as any}
                  id=""
                  type="button"
                  disabled={false}
                >
                  <CopyIcn size={16} />
                </Button>
                <Button
                  onClick={() => lgcGrpDelConf(lgcGrpInd)}
                  icn
                  className="sh-sm btcd-menu-btn tooltip"
                  style={{ '--tooltip-txt': '"Delete Action"' } as any}
                  id=""
                  type="button"
                  disabled={false}
                >
                  <TrashIcn size={16} />
                </Button>
              </div>
            </div>
          </SortableItem>
        ))}
      </SortableList>

      {centralConditionalRows.length > 1 && (
        <div className={css(ut.highlightWrapper)}>
          <strong>{__('Note:')}</strong>
          {' '}
          {__('Conditional logics execute according to the sequence of their logic groups. A group placed higher will have greater priority. To adjust the priority, simply drag and drop the logic groups as needed.')}
        </div>
      )}
    </div>
  )
}

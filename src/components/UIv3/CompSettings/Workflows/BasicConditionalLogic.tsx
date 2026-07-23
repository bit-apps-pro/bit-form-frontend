import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { Link } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { $fields, $proModal, $updateBtn, $workflows } from '../../../../GlobalStates/GlobalStates'
import CloseIcn from '../../../../Icons/CloseIcn'
import { IS_PRO } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import { defaultBasicConditions } from '../../../../Utils/StaticData/form-templates/templateProvider'
import Button from '../../../Utilities/Button'
import Cooltip from '../../../Utilities/Cooltip'
import MtSelect from '../../../Utilities/MtSelect'
import RenderHtml from '../../../Utilities/RenderHtml'
import SingleToggle from '../../../Utilities/SingleToggle'
import { filterFormFields } from '../../../Workflows/WorkflowHelpers'
import WorkflowLogicSection from '../../../Workflows/WorkflowLogicSection'


interface BasicConditionalLogicProps {
  fieldKey: string
  formID?: string
}

interface LogicCondition {
  field: string
  logic: string
  val: string
  smartKey?: string
}

export default function BasicConditionalLogic({ fieldKey, formID }: BasicConditionalLogicProps) {
  const { css } = useFela()
  const [workflows, setWorkflows] = useAtom($workflows)
  const setProModal = useSetAtom($proModal)
  const setUpdateBtn = useSetAtom($updateBtn)
  const fields = useAtomValue($fields)

  // Find the workflow for this field
  const workflowIndex = workflows.findIndex(wf => wf?.info?.fieldKey === fieldKey)
  const currentFieldWorkflow = workflowIndex !== -1 ? workflows[workflowIndex] : null
  const isEnabled = currentFieldWorkflow?.status || false
  const proProperty = 'basicConditionalLogic'
  // Get form fields excluding the current field
  const formFields = filterFormFields({ logics: [] }).filter(f => f.key !== fieldKey)

  const toggleConditionalLogicAction = (e) => {
    if (currentFieldWorkflow) {
      // Disable - remove the workflow
      setWorkflows(prevWorkflows => create(prevWorkflows, draft => {
        draft[workflowIndex].status = e.target.checked ? 1 : 0
      }))
    } else if (!currentFieldWorkflow) {
      // Enable - add a new basic workflow
      const newWorkflow = {
        // id: `basic-${fieldKey}-${Date.now()}`,
        title: `Basic Logic for ${fields[fieldKey]?.adminLbl || fields[fieldKey]?.lbl || fieldKey}`,
        action_type: 'always',
        action_run: 'create_edit',
        action_behaviour: 'cond',
        info: { fieldKey, type: 'basic' }, // Mark this as a basic conditional logic
        conditions: defaultBasicConditions(fieldKey),
        status: 1
      }

      setWorkflows(prevWorkflows => create(prevWorkflows, draft => {
        draft.push(newWorkflow)
      }))
    }
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const changeAction = (action: 'show' | 'hide') => {
    if (!isEnabled || !currentFieldWorkflow) return

    setWorkflows(prevWorkflows => create(prevWorkflows, draft => {
      draft[workflowIndex].conditions[0].actions.fields[0].action = action
      if (action === 'hide') {
        draft[workflowIndex].conditions[1].actions.fields[0].action = 'show'
      } else {
        draft[workflowIndex].conditions[1].actions.fields[0].action = 'hide'
      }
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const addCondition = (groupIndex?: number, operator: 'and' | 'or' = 'and') => {
    if (!isEnabled) return

    setWorkflows(prevWorkflows => create(prevWorkflows, draft => {
      const logics = draft[workflowIndex].conditions[0].logics

      if (groupIndex !== undefined) {
        // Add to specific group
        const group = logics[groupIndex]
        if (Array.isArray(group)) {
          group.push(operator, { field: '', logic: '', val: '' })
        }
      } else {
        // Add new condition at root level
        logics.push(operator, { field: '', logic: '', val: '' })
      }
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const addGroup = () => {
    if (!isEnabled) return

    setWorkflows(prevWorkflows => create(prevWorkflows, draft => {
      const logics = draft[workflowIndex].conditions[0].logics
      logics.push('or', [
        { field: '', logic: '', val: '' },
        'and',
        { field: '', logic: '', val: '' }
      ])
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }


  const currentAction = currentFieldWorkflow?.conditions[0]?.actions?.fields[0]?.action || 'hide'
  const logics = currentFieldWorkflow?.conditions[0]?.logics || []

  return (
    <div className={`${css(styles.container)} bf-basic-conditional-logic`}>
      <div className={css(styles.header)}>
        <label className={css(styles.toggleLabel)}>

          <div className="flx align-center">
            <span className={css(styles.labelText)}>
              {__('Enable Conditional Logic')}
            </span>


            <Cooltip className='hover-tip'>
              <div className="txt-body">
                <RenderHtml html={__('Configure when this field should be shown or hidden')} />
              </div>
            </Cooltip>

          </div>
          <SingleToggle
            id={fieldKey}
            name={fieldKey}
            action={toggleConditionalLogicAction}
            isChecked={isEnabled}
          />

        </label>
      </div>

      {!!isEnabled && (
        <div className={css(styles.content)}>
          <div className={css(styles.actionRow)}>
            <MtSelect
              value={currentAction}
              onChange={(e) => changeAction(e.target.value as 'show' | 'hide')}
              className={css(styles.actionSelect)}
            >
              <option value="hide">{__('Hide')}</option>
              <option value="show">{__('Show')}</option>
            </MtSelect>
            <span className={css(styles.helperText)}>{__('this field if')}</span>
          </div>
          <div className={css(styles.logicContainer)}>
            {currentFieldWorkflow?.conditions?.map((condGrp, condGrpInd) => (
              <Fragment key={`wkf-${condGrpInd + 99}`}>
                {(currentFieldWorkflow.action_behaviour === 'cond' && condGrp.cond_type !== 'else') && (

                  <WorkflowLogicSection
                    lgcGrp={currentFieldWorkflow}
                    lgcGrpInd={workflowIndex}
                    condGrp={condGrp}
                    condGrpInd={condGrpInd}
                    isBasic={true}
                  />
                )}
              </Fragment>
            ))}

          </div>

          <div className={css(styles.footer)}>
            <div className={css(styles.actionRow, { mt: 10 })}>

              <Button
                onClick={() => addCondition()}
                className="tertiary"
              >
                <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                {__('And')}
              </Button>

              <Button
                onClick={() => addCondition(undefined, 'or')}
                className="tertiary"
              >
                <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                {__('Or')}
              </Button>
              <Button
                onClick={addGroup}
                className="tertiary"
              >
                <CloseIcn size="9" className="icn-rotate-45 mr-1" />
                {__('Add Group')}
              </Button>
            </div>

            {IS_PRO && (
              <div className={css(styles.advancedLinkWrapper, { mt: 10 })}>
                <span>{__('Need Advanced Conditional Logic?')}</span>
                <Link
                  to={`/form/settings/edit/${formID}/workflow/${fieldKey}`}
                  className={css(styles.advancedLink)}
                >
                  {__('Switch now')} →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    // bc: '#f9f9f9',
    // brs: 8,
    p: 10,
    my: 15,
    mnh: 200,
    // b: '1px solid #e0e0e0',
  },

  header: {
    flx: 'align-center',
    jc: 'space-between',
    mb: 12,
  },

  toggleLabel: {
    w: '100%',
    flx: 'center-between',
    curp: 1,
    pn: 'relative',
  },
  labelText: {
    fs: 14,
    fw: 500,
    cr: '#374151',
  },

  helpIcon: {
    dy: 'inline-flex',
    ai: 'center',
    jc: 'center',
    w: 18,
    h: 18,
    brs: '50%',
    bc: '#e5e7eb',
    cr: '#6b7280',
    fs: 12,
    fw: 600,
    curp: 1,
  },

  content: {
    mt: 16,
    mnh: '50vh',
  },

  actionRow: {
    flx: 'align-center',
    gp: 'var(--bf-space-4)',
    mb: 16,
  },

  actionSelect: {
    brs: 6,
    bc: '#fff',
    fs: 14,
    curp: 1,
    oe: 0,
    w: '80px !important',

    ':focus': {
      b: '1px solid #2563eb',
      bs: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    },
  },

  helperText: {
    fs: 14,
    cr: '#6b7280',
    fw: 500,
  },

  logicContainer: {
    dy: 'flex',
    fd: 'column',
    gap: 12,
  },

  operator: {
    fs: 12,
    fw: 600,
    cr: '#6b7280',
    tt: 'lowercase',
    py: 4,
    ta: 'center',
  },

  footer: {
    flx: 'flex',
    jc: 'space-between',
    fd: 'column',
    mt: 16,
    // pt: 16,
    bt: '1px solid #e5e7eb',
  },
  advancedLinkWrapper: {
    p: '15px 10px',
    bd: 'var(--bf-secondary-100)',
    brs: 'var(--bf-bdr-radius-sm)',
  },

  advancedLink: {
    fs: 13,
    cr: '#2563eb',
    td: 'none',
    fw: 500,
    ml: 5,
    ':hover': {
      cr: '#1d4ed8',
      td: 'underline',
    },
  },
}
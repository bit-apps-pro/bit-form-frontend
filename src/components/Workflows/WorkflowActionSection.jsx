import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { $updateBtn, $workflows } from '../../GlobalStates/GlobalStates'
import ut from '../../styles/2.utilities'
import { __ } from '../../Utils/i18nwrap'
import CheckBox from '../Utilities/CheckBox'
import EmailNotificationWorkflowAction from './EmailNotificationWorkflowAction'
import FieldWorkflowAction from './FieldWorkflowAction'
import IntegrationWorkflowAction from './IntegrationWorkflowAction'
import RedirectPageWorkflowAction from './RedirectPageWorkflowAction'
import SuccessMsgWorkflowAction from './SuccessMsgWorkflowAction'
import ValidateMsgWorkflowAction from './ValidateMsgWorkflowAction'
// import WebhookWorkflowAction from './WebhookWorkflowAction'

export default function WorkflowActionSection({ lgcGrp, lgcGrpInd, condGrp, condGrpInd }) {
  const { css } = useFela()
  const [workflows, setWorkflows] = useAtom($workflows)
  const setUpdateBtn = useSetAtom($updateBtn)
  const { success: successActions } = condGrp.actions

  const enableAction = (checked, typ) => {
    const tmpWorkflows = create(workflows, draftWorkflow => {
      const { success: draftSuccessActions } = draftWorkflow[lgcGrpInd].conditions[condGrpInd].actions
      if (checked) {
        if (typ === 'mailNotify') {
          draftSuccessActions.push({ type: typ, details: {} })
        } else if (typ === 'dblOptin') {
          draftSuccessActions.push({ type: typ, details: {} })
        } else {
          draftSuccessActions.push({ type: typ, details: { id: '' } })
        }
      } else {
        for (let i = 0; i < draftSuccessActions.length; i += 1) {
          if (draftSuccessActions[i].type === typ) {
            draftSuccessActions.splice(i, 1)
            break
          }
        }
      }
    })

    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const checkKeyInArr = key => successActions?.some(v => v.type === key)

  const preventDelete = val => {
    const tmpWorkflows = create(workflows, draftWorkflow => {
      const { actions } = draftWorkflow[lgcGrpInd].conditions[condGrpInd]
      actions.avoid_delete = val
    })
    setWorkflows(tmpWorkflows)
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const getValueFromArr = (key, subkey) => {
    const value = successActions.find(val => val.type === key)
    if (value !== undefined) {
      return value.details[subkey]
    }
    return ''
  }

  return (
    <>
      {/* action section start */}
      {(lgcGrp.action_type !== 'onvalidate' && lgcGrp.action_run !== 'delete') && (
        <FieldWorkflowAction lgcGrp={lgcGrp} lgcGrpInd={lgcGrpInd} condGrp={condGrp} condGrpInd={condGrpInd} />
      )}
      {(lgcGrp.action_type === 'onsubmit' || lgcGrp.action_run === 'delete') && (
        <>
          <div className={css(ut.mt3, ut.mb1)}><b className="txt-dp">{__('Additional Actions')}</b></div>
          <div className={(condGrp.cond_type === 'always' ? 'ml-4' : '')}>
            {lgcGrp.action_run !== 'delete' && (
              <SuccessMsgWorkflowAction
                lgcGrpInd={lgcGrpInd}
                condGrpInd={condGrpInd}
                enableAction={enableAction}
                checkKeyInArr={checkKeyInArr}
                getValueFromArr={getValueFromArr}
              />
            )}
            {!lgcGrp.action_run.match(/^(delete|edit)$/) && (
              <RedirectPageWorkflowAction
                lgcGrpInd={lgcGrpInd}
                condGrpInd={condGrpInd}
                enableAction={enableAction}
                checkKeyInArr={checkKeyInArr}
                getValueFromArr={getValueFromArr}
              />
            )}
            {/* <WebhookWorkflowAction
              lgcGrpInd={lgcGrpInd}
              condGrpInd={condGrpInd}
              enableAction={enableAction}
              checkKeyInArr={checkKeyInArr}
              getValueFromArr={getValueFromArr}
            /> */}
            {lgcGrp.action_run !== 'delete' && (
              <IntegrationWorkflowAction
                lgcGrpInd={lgcGrpInd}
                condGrpInd={condGrpInd}
                enableAction={enableAction}
                checkKeyInArr={checkKeyInArr}
                getValueFromArr={getValueFromArr}
              />
            )}
            <EmailNotificationWorkflowAction
              title={__('Email Notification')}
              lgcGrpInd={lgcGrpInd}
              condGrpInd={condGrpInd}
              actionKey="mailNotify"
              enableAction={enableAction}
              checkKeyInArr={checkKeyInArr}
              getValueFromArr={getValueFromArr}
            />
            <EmailNotificationWorkflowAction
              title={__('Double Opt-in')}
              lgcGrpInd={lgcGrpInd}
              condGrpInd={condGrpInd}
              actionKey="dblOptin"
              enableAction={enableAction}
              checkKeyInArr={checkKeyInArr}
              getValueFromArr={getValueFromArr}
            />
          </div>
        </>
      )}
      {lgcGrp.action_run === 'delete' && (
        <CheckBox
          className={css({ mt: 5, ml: condGrp.cond_type === 'always' ? 12 : -8 })}
          onChange={e => preventDelete(e.target.checked)}
          checked={workflows[lgcGrpInd]?.conditions[condGrpInd]?.actions?.avoid_delete}
          title={<small className="txt-dp">Prevent Delete</small>}
        />
      )}

      {(lgcGrp.action_type === 'onvalidate' && lgcGrp.action_run !== 'delete') && (
        <ValidateMsgWorkflowAction lgcGrpInd={lgcGrpInd} condGrp={condGrp} condGrpInd={condGrpInd} />
      )}
      {/* action section end */}
    </>
  )
}

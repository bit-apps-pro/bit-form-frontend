/* eslint-disable no-param-reassign */
import { useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { $fields, $updateBtn, $workflows } from '../../GlobalStates/GlobalStates'
import CopyIcn from '../../Icons/CopyIcn'
import TrashIcn from '../../Icons/TrashIcn'
import { IS_PRO } from '../../Utils/Helpers'
import placeholderAllowTypes from '../../Utils/StaticData/placeholderAllowTypes'
import { __ } from '../../Utils/i18nwrap'
import Button from '../Utilities/Button'
import CalculatorField from '../Utilities/CalculationField/CalculatorField'
import MtSelect from '../Utilities/MtSelect'
import { extraFields } from './WorkflowHelpers'

function ActionBlock({
  action, lgcGrp, lgcGrpInd, actionInd, condGrpInd, actionType, formFields,
}) {
  const setWorkflows = useSetAtom($workflows)
  const fields = useAtomValue($fields)
  const setUpdateBtn = useSetAtom($updateBtn)
  const { css } = useFela()
  let fieldKey = ''
  let type = ''

  if (formFields !== null) {
    formFields.map(itm => {
      if (itm.key === action.field) {
        type = itm.type
        fieldKey = itm.key
      }
    })
  }

  const getOptions = () => {
    if (type === 'razorpay') return
    let options
    options = fields?.[fieldKey]?.opt?.map(opt => ({ label: opt.lbl, value: (opt.val || opt.lbl) }))
    if (type === 'select') {
      const { optionsList } = fields?.[fieldKey] || {}
      if (action.action === 'value') {
        return optionsList.reduce((acc, optObj) => {
          const key = Object.keys(optObj)[0]
          const val = Object.values(optObj)[0]
          acc.push({ type: 'group', title: key, childs: val.map(opt => ({ label: opt.lbl, value: (opt.val || opt.lbl) })) })
          return acc
        }, [])
      }
      if (action.action === 'activelist') {
        return optionsList.reduce((acc, cur) => {
          const key = Object.keys(cur)[0]
          acc.push({ label: key, value: key })
          return acc
        }, [])
      }
    }
    if (['decision-box', 'gdpr'].includes(type)) {
      const fldData = fields?.[fieldKey]
      return [
        { label: fldData?.msg?.checked, value: fldData?.msg?.checked },
        { label: fldData?.msg?.unchecked, value: fldData?.msg?.unchecked },
      ]
    }
    if (!options) {
      options = fields?.[fieldKey]?.options?.map(opt => ({ label: opt.lbl, value: (opt.val || opt.code || opt.i || opt.lbl) }))
    }

    return options
  }

  const changeAction = val => {
    setWorkflows(prv => create(prv, draft => {
      const { fields: fldActions } = draft[lgcGrpInd].conditions[condGrpInd].actions
      fldActions[actionInd].action = val
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const changeAtnVal = val => {
    setWorkflows(prv => create(prv, draft => {
      const { fields: fldActions } = draft[lgcGrpInd].conditions[condGrpInd].actions
      fldActions[actionInd].val = val
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const changeAtnField = val => {
    setWorkflows(prv => create(prv, draft => {
      const { fields: fldActions } = draft[lgcGrpInd].conditions[condGrpInd].actions
      fldActions[actionInd].field = val
      if (typeof fldActions[actionInd].val === 'undefined') fldActions[actionInd].val = ''
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const delAction = () => {
    setWorkflows(prv => create(prv, draft => {
      const { fields: fldActions } = draft[lgcGrpInd].conditions[condGrpInd].actions
      if (fldActions.length > 1) {
        fldActions.splice(actionInd, 1)
      }
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const cloneAction = () => {
    setWorkflows(prv => create(prv, draft => {
      const { fields: fldActions } = draft[lgcGrpInd].conditions[condGrpInd].actions
      const newAction = { ...fldActions[actionInd] }
      fldActions.splice(actionInd + 1, 0, newAction)
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const fldType = fields[action.field]?.typ || ''
  const isNotFileUpField = fields[action.field]?.typ !== 'file-up' && fields[action.field]?.typ !== 'advanced-file-up'
  const isNotButtonField = fields[action.field]?.typ !== 'button'
  const isTitleField = fields[action.field]?.typ === 'title'
  const advancedDateTimeTypes = ['advanced-datetime'].includes(fields[action.field]?.typ)
  const isNotSubmitAction = actionType !== 'onsubmit'
  const isNotValidateAction = actionType !== 'onvalidate'
  const isDecisionBox = ['decision-box', 'gdpr'].includes(fields[action.field]?.typ)
  const isAllowPlaceholder = placeholderAllowTypes.includes(fields[action.field]?.typ)
  const isForm = action.field === '_bf_form'

  return (
    <div className="flx pos-rel btcd-logic-blk">
      <MtSelect
        label="Form Fields"
        value={action.field || ''}
        onChange={e => changeAtnField(e.target.value)}
        style={{ width: 720 }}
      >
        <option value="">{__('Select One')}</option>
        {formFields.map(itm => (
          <option
            key={`ff-Ab-${itm.key}`}
            value={itm.key}
          >
            {itm.name}
          </option>
        ))}
        {extraFields.map(itm => (
          <option
            key={`ff-Ab-${itm.key}`}
            value={itm.key}
          >
            {itm.name}
          </option>
        ))}
      </MtSelect>

      <div className={css({ w: 100, flx: 'align-center', h: 35, mt: 5 })}>
        <div className={css({ w: '100%', bd: '#b9c5ff', h: '0.5px' })} />
      </div>

      <MtSelect
        label="Action"
        onChange={e => changeAction(e.target.value)}
        value={action.action || ''}
        style={{ width: 400 }}
        className="w-4"
      >
        <option value="">{__('Select One')}</option>
        {isForm && <option value="save_draft" {...!IS_PRO && { disabled: true }}>{__(`Save Draft ${IS_PRO ? '' : '(PRO)'}`)}</option>}
        {!isForm
          && (
            <>
              {(!isNotButtonField && lgcGrp.action_type === 'oninput') && (
                <option value="click">{__('Click')}</option>
              )}
              {(isNotFileUpField && isNotButtonField && isNotValidateAction) && <option value="value">{__('Value')}</option>}
              {(isNotSubmitAction && isNotValidateAction) && <option value="enable">{__('Enable')}</option>}
              {(isNotSubmitAction && isNotValidateAction) && <option value="disable">{__('Disable')}</option>}
              {(isNotSubmitAction && isNotValidateAction && isNotFileUpField && isNotButtonField) && <option value="readonly">{__('Readonly')}</option>}
              {(isNotSubmitAction && isNotValidateAction && isNotFileUpField && isNotButtonField) && <option value="writeable">{__('Writeable')}</option>}
              {(isNotSubmitAction && isNotValidateAction) && <option value="hide">{__('Hide')}</option>}
              {(isNotSubmitAction && isNotValidateAction) && <option value="show">{__('Show')}</option>}
              {actionType === 'onvalidate' && <option value="required">{__('Required')}</option>}
              {actionType === 'onvalidate' && <option value="notrequired">{__('Not Required')}</option>}
              {fldType === 'select' && <option value="activelist">{__('Active List')}</option>}
              {(isNotSubmitAction && isNotValidateAction && isNotFileUpField && isNotButtonField) && <option value={isDecisionBox ? 'ct' : 'lbl'}>{__('Label')}</option>}
              {(isNotSubmitAction && isNotValidateAction && isNotFileUpField && isNotButtonField) && <option value="sub-titl">{__('Sub Title')}</option>}
              {isAllowPlaceholder && <option value="placeholder">{__('Placeholder')}</option>}
              {(isNotSubmitAction && isNotValidateAction && isNotFileUpField && isNotButtonField && !isTitleField) && <option value="hlp-txt">{__('Helper Text')}</option>}
              {(advancedDateTimeTypes) && <option value="config-option">{__('Config Option')}</option>}
              {isTitleField && <option value="title">{__('Title')}</option>}
            </>
          )}
      </MtSelect>

      {(['value', 'activelist', 'lbl', 'ct', 'sub-titl', 'hlp-txt', 'title', 'placeholder', 'config-option'].includes(action.action)) && (
        <>
          <div className={css({ w: 100, flx: 'align-center', h: 35, mt: 5 })}>
            <div className={css({ w: '100%', bd: '#b9c5ff', h: '0.5px' })} />
          </div>
          <CalculatorField
            label="Value"
            type={type.match(/select|check|radio|number|range|hidden/g) ? 'text' : type}
            onChange={changeAtnVal}
            value={action.val || ''}
            options={getOptions()}
            formFields={formFields}
          />
        </>
      )}
      <div className="btcd-li-side-btn">
        <Button onClick={cloneAction} icn className="ml-2 sh-sm white">
          <CopyIcn />
        </Button>
        <Button onClick={delAction} icn className="ml-2 sh-sm white">
          <TrashIcn />
        </Button>
      </div>
    </div>
  )
}

export default ActionBlock

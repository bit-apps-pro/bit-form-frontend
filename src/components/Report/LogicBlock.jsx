import { useAtomValue } from 'jotai'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { $bits, $fields, $fieldsArr } from '../../GlobalStates/GlobalStates'
import TrashIcn from '../../Icons/TrashIcn'
import { __ } from '../../Utils/i18nwrap'
import Button from '../Utilities/Button'
import DropDown from '../Utilities/DropDown'
import MtInput from '../Utilities/MtInput'
import MtSelect from '../Utilities/MtSelect'
import { additionalFields, disabledLogicType, getLogicOptionByFieldType } from './helper'

function LogicBlock({
  fieldVal, delLogic, lgcInd, subLgcInd, subSubLgcInd, value, changeLogic, logicValue, changeValue, changeFormField,
}) {
  const fields = useAtomValue($fields)

  const flds = useAtomValue($fieldsArr)
  const formFields = flds.concat(additionalFields)

  const bits = useAtomValue($bits)
  const { userMail } = bits
  const disabledLogics = disabledLogicType

  let type = ''
  let fldType = ''
  let fieldKey = ''
  formFields?.find?.(itm => {
    if (itm.key === fieldVal) {
      if (itm.type.match(/^(check|radio|select|html-select|image-select)$/)) {
        type = 'text'
      } else {
        type = itm.type
      }
      fldType = itm.type
      fieldKey = itm.key

      return true
    }
  })

  const getOptions = () => {
    let options = []

    if (fldType === 'select') {
      const { optionsList } = fields?.[fieldKey] || {}
      return optionsList.reduce((acc, optObj) => {
        const key = Object.keys(optObj)[0]
        const val = Object.values(optObj)[0]
        acc.push({ type: 'group', title: key, childs: val.map(opt => ({ label: opt.lbl, value: (opt.val || opt.lbl) })) })
        return acc
      }, [])
    }
    if (['decision-box', 'gdpr'].includes(fldType)) {
      const fldData = fields?.[fieldKey]
      return [
        { label: fldData?.msg?.checked, value: fldData?.msg?.checked },
        { label: fldData?.msg?.unchecked, value: fldData?.msg?.unchecked },
      ]
    }
    options = fields?.[fieldKey]?.opt?.map(opt => ({ label: opt.lbl, value: (opt.val || opt.lbl) }))

    if (fldType === 'user') {
      options = userMail?.map(opt => ({ label: opt.label, value: opt.id }))
    }

    if (fldType === 'boolean') {
      options = [
        { label: __('Read entries'), value: '0' },
        { label: __('Unread entries'), value: '1' },
        { label: __('Confirmed entries'), value: '3' },
        { label: __('Unconfirmed entries'), value: '2' },
        { label: __('Draft entries'), value: '9' },
      ]
    }

    return options
  }

  return (
    <div className="flx pos-rel btcd-logic-blk">
      <span className="btcd-logic-chip logic-chip-custom mr-2">IF</span>
      <MtSelect
        label="Form Fields"
        value={fieldVal || ''}
        style={{ width: 720 }}
        onChange={e => changeFormField(e.target.value, lgcInd, subLgcInd, subSubLgcInd)}
        className="mt-0"
      >
        <option value="">{__('Select Form Field')}</option>
        {formFields.map(itm => !itm.type.match(/^(file-up|recaptcha)$/) && <option key={`ff-lb-${itm.key}`} value={itm.key}>{itm.name}</option>)}
      </MtSelect>

      <svg height="35" width="100">
        <line x1="0" y1="20" x2="40" y2="20" style={{ stroke: '#b9c5ff', strokeWidth: 1 }} />
      </svg>

      <DropDown
        action={val => changeLogic(val, lgcInd, subLgcInd, subSubLgcInd)}
        placeholder={__('Logic')}
        value={logicValue || ''}
        titleClassName="w-7"
        className="mr-2 report-drpdwn w-10 mt-0"
        options={getLogicOptionByFieldType(type, fields, fieldKey)}
      />

      {!disabledLogics.includes(logicValue) && (
        <svg height="35" width="100">
          <line x1="0" y1="20" x2="40" y2="20" style={{ stroke: '#b9c5ff', strokeWidth: 1 }} />
        </svg>
      )}

      {
        (!disabledLogics.includes(logicValue) && (
          fldType.match(/select|check|radio|user|boolean/g)
            ? (
              <MultiSelect
                className="msl-wrp-options btcd-paper-drpdwn w-10"
                defaultValue={value.toString() || ''}
                onChange={e => changeValue(e, lgcInd, fldType)}
                options={getOptions()}
                customValue
                singleSelect={fldType === 'select' ? !fields?.[fieldKey]?.mul : fldType === 'check' ? false : fldType.match(/radio|boolean/g) && true}
                fldType={fldType}
              />
            ) : (

              <MtInput
                label="Value"
                type={type}
                // disabled={disabledLogics.includes(logicValue)}
                onChange={e => changeValue(e.target.value, lgcInd)}
                value={value || ''}
              />
            )

        ))

      }

      <div className="w-1">
        <Button onClick={() => delLogic(lgcInd)} icn className="ml-2 white mr-2 sh-sm abc">
          <TrashIcn size="16" />
        </Button>
      </div>
    </div>
  )
}

export default LogicBlock

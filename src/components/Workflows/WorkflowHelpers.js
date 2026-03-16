import { getAtom } from '../../GlobalStates/BitStore'
import { $allLayouts, $fields, $formInfo, $nestedLayouts } from '../../GlobalStates/GlobalStates'
import { makeFieldsArrByLabel } from '../../Utils/Helpers'

/* eslint-disable import/prefer-default-export */
export const accessToNested = (obj, path = '') => {
  if (path === '') return obj
  const paths = path.split('.')
  const lastIndex = paths.length - 1
  const restPath = paths.slice(0, lastIndex)
  restPath.forEach(p => { obj = obj[p] })
  return paths.length ? obj[paths[lastIndex]] : obj
}

export const extraFields = [
  {
    key: '_bf_form',
    name: 'Form',
  },
  // {
  //   key: '_bf_step_no',
  //   name: 'Step No.',
  // },
]

const flatAllLogics = lgcs => {
  const flatLogics = []
  lgcs.forEach(lgc => {
    if (typeof lgc === 'object' && !Array.isArray(lgc)) {
      flatLogics.push(lgc)
    } else if (Array.isArray(lgc)) {
      flatLogics.push(...flatAllLogics(lgc))
    }
  })
  return flatLogics
}

const getStepBtnAndStepKeys = () => {
  const allLayouts = getAtom($allLayouts)
  const isMultiStep = Array.isArray(allLayouts) && allLayouts.length > 1
  const formInfo = getAtom($formInfo)
  const btnSettings = isMultiStep ? formInfo.multiStepSettings.btnSettings : {}
  const { show, prevBtn, nextBtn } = btnSettings
  const keysObject = {}
  if (isMultiStep) keysObject._bf_step_no = { typ: 'text', key: '_bf_step_no', lbl: 'Active Step' }
  if (!show) return keysObject
  if (prevBtn) keysObject[prevBtn.key] = { ...prevBtn }
  if (nextBtn) keysObject[nextBtn.key] = { ...nextBtn }
  return keysObject
}

export const filterFormFields = condGrp => {
  const allFields = getAtom($fields)
  const fields = { ...allFields, ...getStepBtnAndStepKeys() }
  const nestedLayouts = getAtom($nestedLayouts)
  const formFields = makeFieldsArrByLabel(fields, [])
  const logicFlds = flatAllLogics(condGrp.logics || [])
  const actionFlds = condGrp?.actions?.fields || []
  const allSelectedFlds = [...logicFlds, ...actionFlds].map(fld => fld.field).filter(fld => fld)
  // get all fields that are repeater typ
  const repeaterFlds = formFields.filter(fld => fld.type === 'repeater').map(fld => fld.key)
  // search through by all repeater fields from nested layouts if any of its fields are selected
  let selectedRepeaterFld = ''
  repeaterFlds.forEach(rptFld => {
    const layout = nestedLayouts[rptFld].lg
    const fldsInLayout = layout.map(l => l.i)
    const isAnyFldSelected = fldsInLayout.some(fld => allSelectedFlds.includes(fld))
    if (isAnyFldSelected) selectedRepeaterFld = rptFld
  })
  // if any of repeater fields are selected, then remove all other fields of other repeaters from formFields
  if (selectedRepeaterFld) {
    // other repeater fields
    repeaterFlds.splice(repeaterFlds.indexOf(selectedRepeaterFld), 1)
    const allFldKeysOfOtherRepeater = repeaterFlds.reduce((acc, rptFld) => {
      const layout = nestedLayouts[rptFld].lg
      const fldsInLayout = layout.map(l => l.i)
      return [...acc, ...fldsInLayout]
    }, [])
    return formFields.filter(fld => !allFldKeysOfOtherRepeater.includes(fld.key) && !repeaterFlds.includes(fld.key))
  }
  return formFields
}

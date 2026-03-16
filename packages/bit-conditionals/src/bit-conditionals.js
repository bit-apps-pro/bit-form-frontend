import { checkLogic } from './checkLogic'
import { setActions } from './setActions'

const getFieldKeyByFldName = (fldName, fields) => Object.keys(fields).find(key => fields[key].fieldName === fldName)

const generateFieldName = fldName => fldName?.replace(/\[\d*\]/g, '')

const getAllFieldsValueFromForm = (form, props) => {
  const formData = new FormData(form)
  const { fields } = props
  const formEntries = {}
  const entries = Array.from(formData.entries())
  entries.forEach(([fldName, value]) => {
    const fldKey = getFieldKeyByFldName(generateFieldName(fldName), fields)
    const indexInFldName = fldName.match(/\[(\d+)\]/)?.[1]
    const entriesKey = indexInFldName ? `${fldKey}[${indexInFldName}]` : fldKey
    if (!(fldKey in fields)) return
    if (formEntries[entriesKey]) {
      if (!Array.isArray(formEntries[entriesKey])) formEntries[entriesKey] = [formEntries[entriesKey]]
      formEntries[entriesKey].push(value)
    } else formEntries[entriesKey] = value
  })
  // Add empty values for unselected radio and checkbox fields
  Object.keys(fields).forEach(fldKey => {
    const fieldType = fields[fldKey].typ
    if (['radio', 'check', 'rating', 'image-select'].includes(fieldType)) {
      // Check if this field (or any indexed version) exists in formEntries
      const hasEntry = Object.keys(formEntries).some(key => key === fldKey || key.startsWith(`${fldKey}[`))
      if (!hasEntry) {
        formEntries[fldKey] = ''
      }
    } else if (fieldType === 'button') {
      // For button fields, we can set an empty string or a default value
      formEntries[fldKey] = ''
    }
  })
  if (fields._bf_step_no) formEntries._bf_step_no = String(props.inits.multi_step_form.step || 1)

  return Object.entries(formEntries).reduce((acc, [key, value]) => ({ ...acc, [key]: { value, type: fields[key.replace(/\[\d*\]/g, '')].typ, multiple: Array.isArray(value) } }), {})
}

function isFieldExistInLogics(logics, fldKey) {
  if (Array.isArray(logics)) return logics.some(lgc => isFieldExistInLogics(lgc, fldKey))
  if (typeof logics === 'object') return logics.field === fldKey
  return false
}

function getIndexesByFieldKey(fieldKey, props) {
  if (typeof checkRepeatedField !== 'undefined') {
    const repeatFieldKey = checkRepeatedField(fieldKey, props)
    if (repeatFieldKey) {
      return getRepeatedIndexes(repeatFieldKey, props)
    }
  }
  return false
}

export default function onBlurHandler(event) {
  if (!event?.target?.form) return
  const element = event.target
  const { form } = event.target
  const contentId = form.id.replace('form-', '')
  const props = window.bf_globals?.[contentId]

  if (!props) return

  // STEP 1: Merge extraFields into fields
  const mergedFields = {
    ...props.fields,
    ...(props.extraFields || {}), // Safely handle missing extraFields
  }

  // STEP 2: Create new props object with merged fields
  const newProps = {
    ...props,
    fields: mergedFields, // Override fields with merged version
  }
  const elementIndex = element.name.match(/\[(\d+)\]/)?.[1]

  const targetFieldName = generateFieldName(element.name || element.dataset.parentFieldName)
  const targetFldKey = getFieldKeyByFldName(targetFieldName, newProps.fields)

  if (!targetFldKey) return

  const fieldValues = getAllFieldsValueFromForm(form, newProps)

  // Logics Part
  const condsStatus = []

  const { onfieldCondition } = newProps

  if (!onfieldCondition) return

  const oninputConds = onfieldCondition.filter(cond => cond.event_type === 'on_input')

  const oninputCondsForTargetField = oninputConds.filter(cond => cond.conditions.some(c => isFieldExistInLogics(c?.logics, targetFldKey)))

  if (!oninputCondsForTargetField.length) return

  oninputCondsForTargetField.forEach((workflow, workflowIndx) => {
    const { conditions } = workflow
    const { length } = conditions
    let logicStatus = false
    let rowIndexes = elementIndex ? [elementIndex] : false
    if (!elementIndex && typeof getIndexesBaseOnConditions !== 'undefined') rowIndexes = getIndexesBaseOnConditions(conditions, newProps)
    let rowIndex = rowIndexes ? rowIndexes.pop() : false
    do {
      let condIndx = 0
      for (condIndx = 0; condIndx < length; condIndx += 1) {
        const condition = conditions[condIndx]
        if (['if', 'else-if'].includes(condition.cond_type)) {
          const { logics } = condition
          logicStatus = checkLogic(targetFldKey, logics, fieldValues, newProps, rowIndex)
          // call custom defined function to modify logic status
          if (typeof bf_modify_workflow_logic_status !== 'undefined') logicStatus = bf_modify_workflow_logic_status(logicStatus, logics, fieldValues, rowIndex, condIndx, newProps)
          if (logicStatus) break
        }
      }
      condsStatus.push({ workflowIndx, condIndx, logicStatus, rowIndex })
      rowIndex = rowIndexes ? rowIndexes.pop() : false
    } while (rowIndex)
  })

  // Actions Part
  const alreadySetActions = {}

  condsStatus.reverse()

  condsStatus.forEach(({ workflowIndx, condIndx, logicStatus, rowIndex }) => {
    const { conditions } = oninputCondsForTargetField[workflowIndx]
    const elseActions = conditions.find(cond => cond.cond_type === 'else') || {}
    const condActions = logicStatus ? conditions[condIndx].actions : elseActions.actions
    condActions?.fields?.forEach(actionDetail => {
      let indexes = [rowIndex]
      if (!rowIndex) indexes = getIndexesByFieldKey(actionDetail.field, newProps)
      if (!indexes) indexes = ['']
      indexes.forEach(index => {
        const propertyKey = `${actionDetail.field}[${index}]`
        if (!alreadySetActions[propertyKey]) {
          alreadySetActions[propertyKey] = []
        }
        if (!alreadySetActions[propertyKey].includes(actionDetail.action)) {
          alreadySetActions[propertyKey].push(actionDetail.action)
          const smartFields = Object.entries(newProps.smartTags).reduce((acc, [key, value]) => ({ ...acc, [`\${${key}}`]: { value, type: 'text', multiple: false } }), {})
          setActions(actionDetail, targetFldKey, newProps, { ...fieldValues, ...smartFields }, index)
        }
      })
    })
  })

  return Object.keys(alreadySetActions).length
}

import { useAtomValue } from 'jotai'
import { $nestedLayouts } from '../../../GlobalStates/GlobalStates'
import nestedFieldsObject from './NestedFieldsObject'

export default function BitformFieldMapping({ formFields, notAllowFieldType = [], shortCode = false }) {
  const nestedLayouts = useAtomValue($nestedLayouts)
  const formFieldsObj = nestedFieldsObject(formFields, nestedLayouts, notAllowFieldType)
  const formFieldsArr = Object.keys(formFieldsObj)
  const UcFirst = (str) => (str.charAt(0).toUpperCase() + str.slice(1)).replace(/_/g, ' ')

  const fieldValue = (fld) => {
    const key = fld.newKey ? fld.newKey : fld.key
    if (shortCode) {
      return `\${${key}}`
    }
    return key
  }
  return (
    formFieldsArr.map((key) => (
      <optgroup label={UcFirst(key)} key={`fld-lbl-${key}`}>
        {formFieldsObj[key].map(fld => (
          <option key={`ff-zhcrm-${fld.key}`} value={fieldValue(fld)}>{fld.name}</option>
        ))}
      </optgroup>
    ))
  )
}

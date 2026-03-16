import { getAtom } from '../../GlobalStates/BitStore'
import { $fields } from '../../GlobalStates/GlobalStates'
import { firstCharCap } from '../Helpers'
import { SmartTagField } from './SmartTagField'

const fields = getAtom($fields)
const generateFldName = fld => (fld.lbl || fld.adminLbl || fld.txt)
const generateFieldsOpts = () => Object.entries(fields).map(([fldKey, fldData]) => ({ lbl: generateFldName(fldData) || fldKey, val: `${fldKey}` }))
const generateSmartTagOpts = () => SmartTagField.map(({ name, label }) => ({ lbl: label, val: `bfVars["${name}"]` }))
const generateEventCodeForFld = eventTyp => `/* On Field ${firstCharCap(eventTyp)}*/
document.querySelector(\`#form-\${bfContentId}\`).querySelector(\`#fieldKey-\${bfSlNo}\`).addEventListener('${eventTyp}', event => {
  /* Write your code here*/
})`
const generateEventChild = eventTyp => ({ lbl: `On ${firstCharCap(eventTyp)}`, val: generateEventCodeForFld(eventTyp) })

export const jsPredefinedCodeList = [
  {
    type: 'group-opts',
    name: 'Global Variables/Property',
    childs: [
      {
        lbl: 'Form ID',
        val: 'bf_globals[bfContentId].formId',
      },
      ...generateSmartTagOpts(),
      {
        lbl: 'Dummy Data',
        val: 'window.bf_dummy_data = { /* Overwrite Dummy Data */};',
      },
    ],
  },
  {
    type: 'group-opts',
    name: 'Field Keys',
    childs: [
      ...generateFieldsOpts(),
    ],
  },
  {
    type: 'group-opts',
    name: 'Form Events',
    childs: [
      {
        lbl: 'On Form Submit Success',
        val: `/* On Form Submit Success */
document.querySelector(\`#form-\${bfContentId}\`).addEventListener('bf-form-submit-success', ({detail:{formId, entryId, formData}}) => {
\t/* Write your code here... */
})`,
      },
      {
        lbl: 'On Form Submit Error',
        val: `/* On Form Submit Error */
document.querySelector(\`#form-\${bfContentId}\`).addEventListener('bf-form-submit-error', ({detail:{formId, errors}}) => {
\t/* Write your code here... */
})`,
      },
      {
        lbl: 'On Form Reset',
        val: `/* On Form Reset */
document.querySelector(\`#form-\${bfContentId}\`).addEventListener('bf-form-reset', ({detail:{formId}}) => {
\t/* Write your code here... */
})`,
      },
      {
        lbl: 'On Form Validation Error',
        val: `/* On Form Validation Error */
document.querySelector(\`#form-\${bfContentId}\`).addEventListener('bf-form-validation-error', ({detail:{formId, fieldId, error}}) => {
\t/* Write your code here... */
})`,
      },
    ],
  },
  {
    type: 'group-title',
    name: 'Field Events',
  },
  {
    type: 'group-accordion',
    name: 'Text Field',
    childs: [
      generateEventChild('change'),
      generateEventChild('input'),
      generateEventChild('blur'),
      generateEventChild('focus'),
    ],
  },
  {
    type: 'group-accordion',
    name: 'Textarea Field',
    childs: [
      generateEventChild('change'),
      generateEventChild('input'),
      generateEventChild('blur'),
      generateEventChild('focus'),
    ],
  },
  {
    type: 'group-accordion',
    name: 'Email Field',
    childs: [
      generateEventChild('change'),
      generateEventChild('input'),
      generateEventChild('blur'),
      generateEventChild('focus'),
    ],
  },
  {
    type: 'group-accordion',
    name: 'Checkbox',
    childs: [
      generateEventChild('change'),
    ],
  },
  {
    type: 'group-accordion',
    name: 'Select',
    childs: [
      generateEventChild('change'),
    ],
  },
  {
    type: 'group-accordion',
    name: 'Button',
    childs: [
      generateEventChild('click'),
    ],
  },
  {
    type: 'group-opts',
    name: 'Filter Functions',
    childs: [
      {
        lbl: 'Filter Logic status',
        val: 'function bf_modify_workflow_logic_status(logicStatus, logics, fieldValues, rowIndex, condIndx, props) {\n\t/* write your code here */ \n\treturn logicStatus\n}',
      },
      {
        lbl: 'Filter Razorpay Notes',
        val: 'function bf_modify_razorpay_notes(notes) {\n\t /* write your code here */ \n\treturn notes\n}',
      },
    ],
  },
]

export const cssPredefinedCodeList = [
  {
    type: 'group-opts',
    name: 'Field Keys',
    childs: [
      ...generateFieldsOpts(),
    ],
  },
]

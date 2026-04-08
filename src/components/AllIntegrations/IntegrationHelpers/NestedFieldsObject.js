/**
 *
 * @param {array} fields
 * @param {object} nestedLayouts
 * @param {array} notAllowFieldType
 * @returns {object}
 */

export default function nestedFieldsObject(fields, nestedLayouts = {}, notAllowFieldType = []) {
  const fieldsObj = {
    form_fields: [],
  }

  const layoutsArr = Object.keys(nestedLayouts)

  const nestedFieldLayouts = {
    form_fields: [],
  }

  const nestedFieldKeys = []
  layoutsArr.forEach(fk => {
    const fldArr = nestedLayouts[fk].lg.map(lg => lg.i)
    fields.forEach(field => {
      if (field.key === fk) {
        if (!notAllowFieldType.includes(field.typ)) {
          let prop = ''
          if (field.typ === 'repeater') {
            prop = `${field.adminLbl || field.lbl || field.key}_(Repeater)`
          } else if (field.typ === 'section') {
            prop = `${field.adminLbl || field.lbl || field.key}_(Section)`
          }
          if (!nestedFieldLayouts[prop]) {
            nestedFieldLayouts[prop] = {
              flds: [],
              key: fk,
            }
          }
          nestedFieldLayouts[prop].flds = fldArr
        }
        nestedFieldKeys.push(...fldArr)
      }
    })
  })

  const nestedFieldPropsArr = Object.keys(nestedFieldLayouts)

  fields.forEach(field => {
    nestedFieldPropsArr.forEach(nestedFieldProp => {
      const nestedFields = nestedFieldLayouts[nestedFieldProp].flds
      const nestedKey = nestedFieldLayouts[nestedFieldProp].key
      if (nestedFields && nestedFields.includes(field.key)) {
        if (!fieldsObj[nestedFieldProp]) {
          fieldsObj[nestedFieldProp] = []
        }
        field.newKey = `${nestedKey}.${field.key}`
        fieldsObj[nestedFieldProp].push(field)
      }
    })
    if (!nestedFieldKeys.includes(field.key) && !notAllowFieldType.includes(field.typ)) {
      fieldsObj.form_fields.push(field)
    }
  })

  return fieldsObj
}

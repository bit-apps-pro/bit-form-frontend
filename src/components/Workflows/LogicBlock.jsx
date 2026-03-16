import { useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { $fields } from '../../GlobalStates/GlobalStates'
import CloseIcn from '../../Icons/CloseIcn'
import CopyIcn from '../../Icons/CopyIcn'
import TrashIcn from '../../Icons/TrashIcn'
import { IS_PRO } from '../../Utils/Helpers'
import conditionalLogicsList from '../../Utils/StaticData/ConditionalLogicsList'
import { SmartTagField } from '../../Utils/StaticData/SmartTagField'
import filterFieldTypesForLogicBlock from '../../Utils/StaticData/allStaticArrays'
import { __ } from '../../Utils/i18nwrap'
import Button from '../Utilities/Button'
import CalculatorField from '../Utilities/CalculationField/CalculatorField'
import MtInput from '../Utilities/MtInput'
import MtSelect from '../Utilities/MtSelect'

function LogicBlock({
  logic, fieldVal,
  delLogic,
  lgcInd,
  subLgcInd,
  subSubLgcInd,
  value,
  addInlineLogic,
  cloneInLineLogic,
  changeLogic,
  logicValue,
  changeValue,
  changeSmartKey,
  changeFormField,
  smartTagAllowed,
  formFields,
}) {
  const { css } = useFela()
  const fields = useAtomValue($fields)
  let isSingleSelect = false
  let type = ''
  let fldType = ''
  let fieldKey = ''
  formFields?.find?.(itm => {
    if (itm.key === fieldVal) {
      if (itm.type.match(/^(check|radio|select|html-select|image-select|hidden)$/)) {
        type = 'text'
      } else {
        type = itm.type
      }
      fldType = itm.type
      fieldKey = itm.key

      return true
    }
  })
  const checkLoginOption = [
    { label: __('Logged In'), value: 'logged_in' },
    { label: __('Logged Out'), value: 'logged_out' },
  ]

  const getOptions = () => {
    if (fldType === 'razorpay') return
    let options
    if (fldType === 'user') {
      options = checkLoginOption
    } else {
      options = fields?.[fieldKey]?.opt?.map(opt => ({ label: opt.lbl, value: (opt.val || opt.lbl) }))
    }
    if (fldType === 'select') {
      const { optionsList } = fields?.[fieldKey] || {}
      return optionsList.reduce((acc, optObj) => {
        const key = Object.keys(optObj)[0]
        const val = Object.values(optObj)[0]
        acc.push({ type: 'group', title: key, childs: val.map(opt => ({ label: opt.lbl, value: (opt.val || opt.lbl) })) })
        return acc
      }, [])
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

  const findFldTypeFromLogicsArr = (needleFieldTyp, logicsArr) => logicsArr.find(itm => {
    if (itm === needleFieldTyp) return true
    if (!itm.includes('.')) return false
    const firstDot = itm.indexOf('.')
    const fieldType = itm.substring(0, firstDot)
    if (needleFieldTyp !== fieldType) return false
    const dataProps = itm.substring(firstDot + 1)
    if (!dataProps) return false
    const [propsPath, propValue] = dataProps.split(':')
    const nestedProps = propsPath.split('.')
    const fldData = formFields.find(fld => fld.key === fieldKey) || {}
    const nestedPropsValue = nestedProps.reduce((acc, nestedItm) => acc[nestedItm], fldData)
    return nestedPropsValue === propValue
  })

  const findTagFromSmartTags = tagName => SmartTagField.find(itm => tagName === `\${${itm.name}}`)

  if (!type) {
    type = findTagFromSmartTags(fieldVal)?.type || ''
  }
  if (!isSingleSelect) {
    isSingleSelect = findTagFromSmartTags(fieldVal)?.singleSelect || false
  }

  const getLogicsBasedOnFieldType = needleFldType => {
    const foundFldType = findTagFromSmartTags(fieldVal)?.type || needleFldType
    if (!foundFldType) return []
    const logicsArr = Object.entries(conditionalLogicsList)
    return logicsArr.reduce((acc, [key, data]) => {
      if (data.notFields && findFldTypeFromLogicsArr(foundFldType, data.notFields)) return acc
      if (data.fields) {
        if (findFldTypeFromLogicsArr(foundFldType, data.fields)) return [...acc, { key, lbl: data.label }]
        return acc
      }
      return [...acc, { key, lbl: data.label }]
    }, [])
  }

  const getCustomSmartTagsLabel = tagName => {
    // eslint-disable-next-line no-template-curly-in-string
    if (tagName === '${_bf_custom_date_format()}') return __('Date Format')
    // eslint-disable-next-line no-template-curly-in-string
    if (tagName === '${_bf_user_meta_key()}') return __('Meta Key')
    // eslint-disable-next-line no-template-curly-in-string
    if (tagName === '${_bf_query_param()}') return __('Query Param')
    return 'Smart Key'
  }

  // this filter function is remove "'" from contentValue like "'2020-12-12'" to set valid date value
  const filterDateValue = contentValue => {
    if (type.match(/date|advanced-datetime/g)) {
      return contentValue?.replace(/^'|'$/g, '')
    }
    return contentValue
  }
  // this alter function is add "'" from contentValue like "'2020-12-12'" for Avoid math execution in conditional logic
  const alterDateValue = rawValue => {
    if (type.match(/date|advanced-datetime/g) && rawValue?.includes('-')) {
      return `'${rawValue}'`
    }
    return rawValue
  }

  const notNeededValField = ['change', 'null', 'not_null', 'on_click']
  return (
    <div className={`${css(lgcStyle.lgcBlk)} btcd-logic-blk`}>
      <div className={css(lgcStyle.processDgrm)}>
        <div className="block-wrapper">
          <div className="block-content">
            <MtSelect
              label="Form Fields"
              value={fieldVal}
              onChange={e => changeFormField(e.target.value, lgcInd, subLgcInd, subSubLgcInd)}
            >
              <option value="">{__('Select Form Field')}</option>
              {!!formFields.length && (
                <optgroup label="Form Fields">
                  {formFields.map(itm => !filterFieldTypesForLogicBlock.includes(itm.type)
                    && <option key={`ff-lb-${itm.key}`} value={itm.key}>{itm.name}</option>)}
                </optgroup>
              )}
              {smartTagAllowed && (
                <optgroup label={`General Smart Codes ${IS_PRO ? '' : '(PRO)'}`}>
                  {SmartTagField?.map(({ name, label }) => (
                    <option key={`ff-rm-${name}`} value={`\${${name}}`} disabled={!IS_PRO}>
                      {label}
                    </option>
                  ))}
                </optgroup>
              )}
            </MtSelect>
          </div>
        </div>

        {findTagFromSmartTags(fieldVal)?.functionParam && (
          <div className="block-wrapper">
            <div className="block-content">
              <MtSelect
                label="Field Parameter"
                onChange={e => changeSmartKey(e.target.value, lgcInd, subLgcInd, subSubLgcInd)}
                value={logic.smartKey || ''}
              >
                <option value="">{__('Select Form Field')}</option>
                {!!formFields.length && (
                  <optgroup label="Form Fields">
                    {formFields.map(itm => !itm.type.match(/^(file-up|recaptcha)$/)
                      && <option key={`ff-lb-${itm.key}`} value={itm.key}>{itm.name}</option>)}
                  </optgroup>
                )}
              </MtSelect>
            </div>
          </div>
        )}

        {findTagFromSmartTags(fieldVal)?.custom && !findTagFromSmartTags(fieldVal)?.functionParam && (
          <div className="block-wrapper">
            <div className="block-content">
              <MtInput
                label={getCustomSmartTagsLabel(fieldVal)}
                type="text"
                onChange={e => changeSmartKey(e.target.value, lgcInd, subLgcInd, subSubLgcInd)}
                value={logic.smartKey || ''}
              />
            </div>
          </div>
        )}

        <div className="block-wrapper">
          <div className="block-content">
            <MtSelect
              label="Logic"
              value={logicValue}
              onChange={e => changeLogic(e.target.value, lgcInd, subLgcInd, subSubLgcInd)}
            >
              <option value="">{__('Select One')}</option>
              {getLogicsBasedOnFieldType(type).map(({ key, lbl }) => (
                <option key={key} value={key}>
                  {lbl}
                </option>
              ))}
            </MtSelect>
          </div>
        </div>

        {logicValue !== 'between' && logicValue !== 'not between' && !notNeededValField.includes(logicValue) && (
          <div className="block-wrapper">
            <div className="block-content">
              {type.match(/user|select|check|radio/g)
                ? (
                  <MultiSelect
                    className="msl-wrp-options btcd-paper-drpdwn"
                    defaultValue={value || ''}
                    onChange={e => changeValue(e, lgcInd, subLgcInd, subSubLgcInd)}
                    options={getOptions()}
                    // customValue
                    fldType={type}
                    singleSelect={isSingleSelect}
                  />
                ) : (
                  <CalculatorField
                    label="Value"
                    type={type.match(/select|check|radio|number|range/g) ? 'text' : type}
                    disabled={logicValue === 'null' || logicValue === 'not_null'}
                    onChange={val => changeValue(alterDateValue(val), lgcInd, subLgcInd, subSubLgcInd)}
                    value={filterDateValue(value) || ''}
                    options={getOptions()}
                    formFields={formFields}
                  />
                )}
            </div>
          </div>
        )}

        {(logicValue === 'between' || logicValue === 'not between') && (
          <div className="block-wrapper">
            <div className="block-group">
              <div className="block-wrapper">
                <div className="block-content">
                  {fldType.match(/select|check|radio/g)
                    ? (
                      <MultiSelect
                        className="msl-wrp-options btcd-paper-drpdwn"
                        defaultValue={value.min || ''}
                        onChange={e => changeValue(e, lgcInd, subLgcInd, subSubLgcInd, 'min')}
                        options={getOptions()}
                        customValue
                        fldType={fldType}
                      />
                    ) : (
                      <MtInput
                        label="Min Value"
                        type={type}
                        disabled={logicValue === 'null' || logicValue === 'not_null'}
                        onChange={e => changeValue(alterDateValue(e.target.value), lgcInd, subLgcInd, subSubLgcInd, 'min')}
                        value={filterDateValue(value.min) || ''}
                      />
                    )}
                </div>
              </div>
              <div className="block-wrapper">
                <div className="block-content">
                  {fldType.match(/select|check|radio/g)
                    ? (
                      <MultiSelect
                        className="msl-wrp-options btcd-paper-drpdwn"
                        defaultValue={value.max || ''}
                        onChange={e => changeValue(e, lgcInd, subLgcInd, subSubLgcInd, 'max')}
                        options={getOptions()}
                        customValue
                        fldType={fldType}
                      />
                    ) : (
                      <MtInput
                        label="Max Value"
                        type={type}
                        disabled={logicValue === 'null' || logicValue === 'not_null'}
                        onChange={e => changeValue(alterDateValue(e.target.value), lgcInd, subLgcInd, subSubLgcInd, 'max')}
                        value={filterDateValue(value.max) || ''}
                      />
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="btcd-li-side-btn">
        <Button
          onClick={() => cloneInLineLogic(lgcInd, subLgcInd, subSubLgcInd)}
          icn
          className="ml-2 white sh-sm"
        >
          <CopyIcn size="16" />
        </Button>
        <Button
          onClick={() => delLogic(lgcInd, subLgcInd, subSubLgcInd)}
          icn
          className="ml-2 white mr-2 sh-sm"
        >
          <TrashIcn size="16" />
        </Button>
        <Button
          onClick={() => addInlineLogic('and', lgcInd, subLgcInd, subSubLgcInd)}
          className="white mr-2 sh-sm"
        >
          <CloseIcn size="10" className="icn-rotate-45 mr-1" />
          AND
        </Button>
        <Button
          onClick={() => addInlineLogic('or', lgcInd, subLgcInd, subSubLgcInd)}
          className="white sh-sm"
        >
          <CloseIcn size="10" className="icn-rotate-45 mr-1" />
          OR
        </Button>
      </div>
    </div>
  )
}

export default LogicBlock

const lgcStyle = {
  lgcBlk: {
    pn: 'relative',
    dy: 'flex',
    cg: 15,
    rg: 15,
    my: 5,

    ':hover': { bc: '#F0F0F0' },
  },

  lgcGrp: {
    b: '0.5px solid #D5D5D5',
    brs: 8,
    p: 10,
    ml: 20,
  },

  blkItm: { w: '100%' },

  processDgrm: {
    '--linethick': '1px',
    '--linewidth': '1.5em',
    '--line-color': '#b9c5ff',

    flx: 'align-center',
    w: '100%',
    m: 0,
    p: 0,
    ls: 'none',
    ta: 'center',

    '& > .block-wrapper': { flex: '1 1 auto' },

    /* node style */
    '& .block-wrapper>.block-content': {
      cr: '#666',
      brs: 10,
    },

    /* connecting lines between nodes */
    '& .block-wrapper::before, & .block-wrapper::after, & .block-group::before, & .block-group::after, & .block-content::before, & .block-content::after': {
      bse: 'solid',
      bcr: 'var(--line-color)',
    },

    '& .block-wrapper .block-group .block-wrapper:first-child .block-content::before, &  .block-wrapper .block-group .block-wrapper:first-child::before': { btlr: 10 },

    '&  .block-wrapper .block-group .block-wrapper:first-child .block-content::after, & .block-wrapper .block-group .block-wrapper:first-child::after': { btrr: 10 },

    '&  .block-wrapper .block-group .block-wrapper:last-child .block-content::before, &  .block-wrapper .block-group .block-wrapper:last-child::before': { bblr: 10 },

    '&  .block-wrapper .block-group .block-wrapper:last-child .block-content::after, &  .block-wrapper .block-group .block-wrapper:last-child::after': { bbrr: 10 },

    '& ol, & .block-group, & .block-wrapper': {
      ls: 'none',
      ta: 'center',
    },

    '& .block-wrapper': { pn: 'relative', mb: 0, w: '100%' },

    '& > .block-wrapper, & ol > .block-wrapper, & .block-group > .block-wrapper': { p: '4px 0' },

    '&  .block-group': { pn: 'relative', pl: 'var(--linewidth)' },

    '& .block-group::before, &  .block-group::after': {
      pn: 'absolute',
      ct: '""',
      tp: '50%',
      w: 'var(--linewidth)',
      dy: 'block',
      bwh: 'var(--linethick) 0 0',
    },

    '& .block-group::before': { lt: 0 },

    '&  .block-group::after': { rt: 0 },

    '&  .block-group>.block-wrapper::after, &  .block-group>.block-wrapper::before': {
      pn: 'absolute',
      ct: '""',
      tp: 0,
      bm: 0,
      w: 'var(--linewidth)',
      h: '100%',
      dy: 'block',
    },

    '&  .block-group>.block-wrapper::before': {
      lt: 0,
      bwh: '0 0 0 var(--linethick)',
    },

    '&  .block-group>.block-wrapper::after': {
      rt: 0,
      bwh: '0 var(--linethick) 0 0',
    },

    /* correct length and pn of dashes for first and last .block-wrapper-item in .block-group */
    '&  .block-group>.block-wrapper:first-child::before, &  .block-group>.block-wrapper:first-child::after': {
      tp: '50%',
      bm: 'auto',
      h: '50%',
    },

    '&  .block-group>.block-wrapper:last-child::before, &  .block-group>.block-wrapper:last-child::after': {
      tp: 0,
      bm: 'auto',
      h: '50%',
    },

    '&  .block-group>.block-wrapper:first-child:last-child::before, &  .block-group>.block-wrapper:first-child:last-child::after': {
      tp: 0,
      bm: 'auto',
      h: '50%',
    },

    '&  .block-wrapper>.block-content': {
      pn: 'relative',
      ml: 'var(--linewidth)',
    },

    '& >.block-wrapper:first-child>.block-content': { ml: 0 },

    '&  .block-wrapper:not(:last-child) .block-wrapper>.block-content': { mr: 'var(--linewidth)' },

    '&  .block-wrapper>.block-content::before, &  .block-wrapper>.block-content::after': {
      ct: '""',
      tp: '50%',
      w: 'var(--linewidth)',
      pn: 'absolute',
      bwh: 'var(--linethick) 0 0',
      h: '50%',
    },

    '&  .block-wrapper>.block-content::after': {
      rt: 'calc(0em - var(--linewidth) + 2px)',
      mr: 'calc(0px - var(--linethick))',
    },

    '&  .block-wrapper>.block-content::before': {
      lt: 'calc(0em - var(--linewidth) + 2px)',
      ml: 'calc(0px - var(--linethick))',
    },

    '&  .block-wrapper:last-child>.block-content::after, & .block-wrapper:last-child>.block-content::before': {
      tp: 0,
      bwh: '0 0 var(--linethick)',
    },

    '& >.block-wrapper:first-child>.block-content::before, & >.block-wrapper:first-child>.block-group::before, & >.block-wrapper:first-child>.block-group>.block-wrapper::before, & >.block-wrapper:first-child>.block-group>.block-wrapper>.block-content:first-child::before, & >.block-wrapper:first-child>.block-group>.block-wrapper>ol>.block-wrapper:first-child>.block-content::before, & >.block-wrapper:last-child>.block-content::after, & >.block-wrapper:last-child>.block-group::after': { b: 0 },

    '& >.block-wrapper>.block-content::after,  &  ol>.block-wrapper>.block-content::after, & >.block-wrapper>.block-group::after,  &  ol>.block-wrapper>.block-group::after': { dy: 'none' },

    '& >.block-wrapper>.block-content, &  ol>.block-wrapper>.block-content': { mr: 0 },

    '& >.block-wrapper>.block-group,  &  ol>.block-wrapper>.block-group': { pr: 0 },

    '& >.block-wrapper:last-child>.block-content::after,  &  ol>.block-wrapper:last-child>.block-content::after,  & >.block-wrapper:last-child>.block-group::after,  &  ol>.block-wrapper:last-child>.block-group::after': { dy: 'block' },

    '& >.block-wrapper:last-child>.block-content, & ol>.block-wrapper:last-child>.block-content': { mr: 0 },

    '&  .block-wrapper:last-child>.block-group::after,  &  .block-wrapper:last-child>.block-group>.block-wrapper::after,  &  .block-wrapper:last-child>.block-group>.block-wrapper>.block-content::after': { dy: 'none' },
  },

}

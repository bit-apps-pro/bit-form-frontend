import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Cooltip from './Cooltip'

function DropDown({
  options, placeholder, action, className, isMultiple, allowCustomOpt, value, addable, titleClassName, title, jsonValue, disabled = false, tip,
}) {
  const { css } = useFela()
  const [val, setVal] = useState(value)
  useEffect(() => {
    setVal('')

    setTimeout(() => {
      setVal(value)
    }, 1)
  }, [value, options, jsonValue])

  return (
    <div className={titleClassName}>
      <span>{title}</span>
      {tip ? (
        <Cooltip icnSize={14}>
          {tip}
        </Cooltip>
      ) : ''}
      <MultiSelect
        width="100%"
        defaultValue={val}
        className={`${css(dropdownCls.multiselectInput)} ${className}`}
        onChange={action}
        singleSelect={!isMultiple}
        customValue={allowCustomOpt || addable}
        placeholder={placeholder}
        jsonValue={jsonValue}
        options={options || []}
        disabled={disabled}
      />
    </div>
  )
}

export default (DropDown)

const dropdownCls = {
  multiselectInput: {
    fs: 14,
    fw: 500,
    mt: 10,
    '& .msl': {
      // h: '32px!important',
      bd: 'var(--b-79-96)',
      b: 0,
      '&.msl-active-up': {
        'border-bottom-left-radius': 0,
        'border-bottom-right-radius': 0,
        'border-top-left-radius': '8px',
        'border-top-right-radius': '8px',
        background: '#fff !important',
      },
      '& .msl-input': { p: 3, cr: '#2c3338' },
    },
    '& .msl-active-up~.msl-options': {
      'max-height': '300px',
      '-webkit-clip-path': 'inset(0px -10px 0 -10px)',
      'clip-path': 'inset(0px -10px 0 -10px)',
    },
    '&.msl-vars': { w: '99% !important', '--font-size': '12px' },
    '&.msl-wrp > .msl-options': {
      // pn: 'relative !important',
      pn: 'absolute !important',
      'border-top-left-radius': 0,
      'border-top-right-radius': 0,
      '& div > .msl-option': { p: '4px 4px' },
    },
    '& > .msl-wrp > .msl-active-up': {
      brs: 8,
      bblr: '0 !important',
      bbrr: '0 !important',
    },
    b: '1px solid #e6e6e6 !important',
    '::placeholder': { cr: 'hsl(215deg 16% 57%)', fs: 12 },
    ':focus': { bs: '0 0 0 1px var(--b-50) !important', bcr: 'var(--b-50)!important' },
  },

}

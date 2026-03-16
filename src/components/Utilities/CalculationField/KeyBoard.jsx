/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { useFela } from 'react-fela'
import { hideAll } from 'tippy.js'
import BackIcn from '../../../Icons/BackIcn'
import CloseIcn from '../../../Icons/CloseIcn'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import ut from '../../../styles/2.utilities'

function KeyBoard({ clickAction, options, formFields }) {
  const keyList = [
    { id: 25, type: 'back', content: <BackIcn size="18" /> },
    { id: 6, type: 'operator', content: '(' },
    { id: 7, type: 'operator', content: ')' },
    { id: 8, type: 'empty', content: '' },
    { id: 9, type: 'number', content: '7' },
    { id: 10, type: 'number', content: '8' },
    { id: 11, type: 'number', content: '9' },
    { id: 12, type: 'operator', content: '/' },
    { id: 13, type: 'number', content: '4' },
    { id: 14, type: 'number', content: '5' },
    { id: 15, type: 'number', content: '6' },
    { id: 16, type: 'operator', content: '*' },
    { id: 17, type: 'number', content: '1' },
    { id: 18, type: 'number', content: '2' },
    { id: 19, type: 'number', content: '3' },
    { id: 20, type: 'operator', content: '+' },
    { id: 24, type: 'clear', content: 'AC' },
    { id: 21, type: 'number', content: '0' },
    { id: 22, type: 'number', content: '.' },
    { id: 23, type: 'operator', content: '-' },
  ]

  const { css } = useFela()

  return (
    <div className={css(style.board)}>
      <div className={css(style.leftSlider)}>
        {options && (
          <>
            <h4 className={css({ m: 0, td: 'underline', mt: 5 })}>Options</h4>
            {options.map((option, index) => (option.type === 'group' ? (
              <>
                <h4 className={css({ m: 0 })}>{option.title}</h4>
                {option.childs.map((child) => (
                  <div
                    role="button"
                    className={css(style.field, ut.ml1)}
                    key={`${child.value}${index + 1}`}
                    onClick={() => clickAction(`${index + 1}`, 'option', { label: child.label, content: child.value }, child.value.length)}
                    tabIndex={0}
                    onKeyDown={undefined}
                  >
                    {child.label}
                  </div>
                ))}
              </>
            ) : (
              <div
                role="button"
                className={css(style.field)}
                key={`${option.value}${index + 1}`}
                onClick={() => clickAction(`${index + 1}`, 'option', { label: option.label, content: option.value }, option.value.length)}
                tabIndex={0}
                onKeyDown={undefined}
              >
                {option.label}
              </div>
            )))}
            <div
              role="button"
              className={css(style.field)}
              onClick={() => clickAction(199, 'field', { label: 'Separator', content: '_bf_separator' })}
              tabIndex={0}
              onKeyDown={undefined}
            >
              Separator
            </div>
          </>
        )}
        <h4 className={css({ m: 0 })}>Form Fields</h4>
        {formFields?.map((field, index) => (
          <div
            role="button"
            className={css(style.field)}
            key={`field-${index}`}
            onClick={() => clickAction(`${index + 1}`, 'field', { label: field.name, content: field.key })}
            tabIndex={0}
            onKeyDown={undefined}
          >
            {field.name}
          </div>
        ))}
        <h4 className={css({ m: 0, td: 'underline', mt: 5 })}>Smart Tags</h4>
        {SmartTagField.map((smartTag, index) => (
          <div
            role="button"
            className={css(style.field)}
            key={smartTag.id}
            onClick={() => clickAction(`${index + 1}`, 'field', { label: smartTag.label, content: smartTag.name, isFunction: smartTag.custom })}
            tabIndex={0}
            onKeyDown={undefined}
          >
            {smartTag.label}
          </div>
        ))}
      </div>
      <div className={css(style.keyContainer)}>
        {keyList.map((keyItem) => (
          <div
            role="button"
            className={`custom-button ${css(style.customButton)} ${keyItem.type}`}
            key={keyItem.id}
            onClick={() => clickAction(keyItem.id, keyItem.type, { content: keyItem.content })}
            tabIndex={0}
            onKeyUp={undefined}
          >
            {keyItem.content}
          </div>
        ))}
        <span role="button" className={css(style.crossButton)} onClick={() => hideAll()} tabIndex={0} onKeyDown={undefined}>
          <CloseIcn size="12" />
        </span>
      </div>

    </div>
  )
}

export default KeyBoard

const style = {
  board: {
    w: 310,
    h: 225,
    p: 2,
    brs: 5,
    dy: 'flex',
    ta: 'left',
  },
  leftSlider: {
    w: '40%',
    h: '100%',
    bc: '#F8F8F8',
    brs: 8,
    cr: '#6A6A6A',
    dy: 'flex',
    fd: 'column',
    p: 5,
    mr: 5,
    ow: 'overlay',
    wb: 'break-word',
  },
  keyContainer: {
    w: '60%',
    h: '100%',
    bc: 'white',
    dy: 'flex',
    flxp: 'wrap',
    pn: 'relative',
  },
  h4: { fw: '500' },
  field: {
    fw: '400',
    fs: '12px !important',
    brs: '8px',
    padding: '5px',
    cur: 'pointer',
    ':hover': { bc: '#E5E5E5' },
  },
  customButton: {
    w: '45px',
    h: '45px',
    brs: '10px',
    br: 'none',
    bc: 'white',
    cr: 'black',
    dy: 'flex',
    ai: 'center',
    jc: 'center',
    cur: 'pointer',
    fw: '600',
    fs: '18px',
    lh: '17px',
    ':hover': { bc: '#F8F8F8' },
    '&.empty:hover': {
      bc: 'white',
      cur: 'default',
    },
  },
  crossButton: {
    pn: 'absolute',
    w: '20px',
    h: '20px',
    brs: '50%',
    bc: '#F4F4F4',
    dy: 'flex',
    jc: 'center',
    ai: 'center',
    cur: 'pointer',
    rt: '-5px',
    tp: '-5px',
  },
}

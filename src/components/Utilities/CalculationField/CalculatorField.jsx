/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */

import Tippy from '@tippyjs/react'
import { useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useRef, useState } from 'react'
import { useFela } from 'react-fela'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import { $fields } from '../../../GlobalStates/GlobalStates'
import BdrDottedIcn from '../../../Icons/BdrDottedIcn'
import { makeFieldsArrByLabel } from '../../../Utils/Helpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../MtInput'
import KeyBoard from './KeyBoard'

/* eslint-disable jsx-a11y/label-has-associated-control */
function CalculatorField({
  label, onChange, value, disabled, type, textarea, className, options, formFields,
}) {
  const { css } = useFela()
  const fields = useAtomValue($fields)
  const fieldArr = makeFieldsArrByLabel(fields)
  const expressionIdRef = useRef(0)
  const createExpressionToken = (tokenType, dataObj) => {
    const expressionId = expressionIdRef.current
    expressionIdRef.current += 1
    return {
      id: expressionId,
      type: tokenType,
      dataObj,
    }
  }
  const [expressions, setExpressions] = useState(() => initialExpression(value, fieldArr, createExpressionToken))
  const [caretPosition, setCaretPosition] = useState(expressions.length)
  const [keyboardActive, setKeyboardActive] = useState(false)
  const expRef = useRef(null)
  const enableCalculator = expressions.length > 0

  const onFocusOutAction = (e) => {
    let val = ''
    let funParam = 0
    let parnthasis = 0
    !keyboardActive && setExpressions(preExp => preExp.filter(exp => exp?.type !== 'caret'))
    expressions.map(exp => {
      if (exp.type === 'field') {
        if (exp.dataObj.isFunction) {
          funParam += 1
          val += `\${${exp.dataObj.content}`
        } else { val += `\${${exp.dataObj.content}}` }
      } else {
        val += exp.dataObj.content
        if (funParam && exp.dataObj.content === '(') parnthasis += 1
        if (funParam && exp.dataObj.content === ')') {
          parnthasis -= 1
          if (!parnthasis) {
            val += '}'
            funParam -= 1
          }
        }
      }
    })
    while (funParam--) val += '}'
    onChange(val)
  }

  const onFocusInAction = () => {
    !keyboardActive && setExpressions(oldExp => create(oldExp, draftExp => {
      draftExp.splice(caretPosition, 0, createExpressionToken('caret', { content: '' }))
    }))
  }

  const inputKeyPressAction = (event) => {
    const { key } = event
    const newPosition = event.target.selectionEnd
    setCaretPosition(newPosition)
    if (enableCalculator) keyPressAction({ key })
  }

  const keyPressAction = (event) => {
    const { key } = event
    event.preventDefault && event.preventDefault()
    if ((key === 'ArrowUp' || key === 'Home') && caretPosition > 0) {
      setExpressions(oldExp => {
        const exps = oldExp.filter(exp => exp.type !== 'caret')
        exps.unshift(createExpressionToken('caret', { content: '' }))
        return exps
      })
      setCaretPosition(0)
    } else if ((key === 'ArrowDown' || key === 'End') && caretPosition < expressions.length - 1) {
      const newCaretPos = expressions.length - 1
      setExpressions(oldExp => {
        const exps = oldExp.filter(exp => exp.type !== 'caret')
        exps.push(createExpressionToken('caret', { content: '' }))
        return exps
      })
      setCaretPosition(newCaretPos)
    } else if (key === 'ArrowLeft' && caretPosition > 0) {
      const newCaretPos = caretPosition - 1
      setCaretPosition(newCaretPos)
      setExpressions(oldExp => create(oldExp, draftExp => {
        [draftExp[newCaretPos], draftExp[newCaretPos + 1]] = [draftExp[newCaretPos + 1], draftExp[newCaretPos]]
      }))
    } else if (key === 'ArrowRight' && caretPosition < expressions.length - 1) {
      const newCaretPos = caretPosition + 1

      setCaretPosition(newCaretPos)
      setExpressions(oldExp => create(oldExp, draftExp => {
        [draftExp[newCaretPos - 1], draftExp[newCaretPos]] = [draftExp[newCaretPos], draftExp[newCaretPos - 1]]
      }))
    } else if (key === 'Backspace') {
      if (caretPosition > 0) {
        setExpressions(oldState => oldState.slice(0, caretPosition - 1).concat(oldState.slice(caretPosition)))
        setCaretPosition(oldPosition => oldPosition - 1)
      }
    } else if (key === 'Delete') {
      if (caretPosition < expressions.length) {
        setExpressions(oldState => oldState.slice(0, caretPosition + 1).concat(oldState.slice(caretPosition + 2)))
      }
    } else if (/^\s{1}/.test(key)) {
      setExpressions(oldExp => create(oldExp, draftExp => {
        draftExp.splice(caretPosition, 0, createExpressionToken('space', { content: key }))
      }))
      setCaretPosition(oldPosition => oldPosition + 1)
    } else if ((!isNaN(key)) || key === '.') {
      setExpressions(oldExp => create(oldExp, draftExp => {
        draftExp.splice(caretPosition, 0, createExpressionToken('number', { content: key }))
      }))
      setCaretPosition(oldPosition => oldPosition + 1)
    } else if ('+-*/(),<>'.indexOf(key) !== -1) {
      setExpressions(oldExp => create(oldExp, draftExp => {
        draftExp.splice(caretPosition, 0, createExpressionToken('operator', { content: key }))
      }))
      setCaretPosition(oldPosition => oldPosition + 1)
    } else if (/^[!@#$%^&*()\\=,.?"':{}[\]|_<>]$/.test(key)) {
      setExpressions(oldExp => create(oldExp, draftExp => {
        draftExp.splice(caretPosition, 0, createExpressionToken('symbol', { content: key }))
      }))
      setCaretPosition(oldPosition => oldPosition + 1)
    } else if (/^([A-Z]|[a-z]){1}\b/.test(key)) {
      setExpressions(oldExp => create(oldExp, draftExp => {
        draftExp.splice(caretPosition, 0, createExpressionToken('letters', { content: key }))
      }))
      setCaretPosition(oldPosition => oldPosition + 1)
    }
  }

  /* This Function is move custom caret to specific position */
  function moveCaret(newPosition, side = 'before') {
    if (side === 'straight') {
      if (caretPosition !== newPosition) {
        setExpressions(oldExpression => {
          const exps = oldExpression.filter(exp => exp.type !== 'caret')
          exps.splice(newPosition, 0, createExpressionToken('caret', { content: '' }))
          return exps
        })
        setCaretPosition(newPosition)
      }
    } else if (side === 'before' && caretPosition !== newPosition - 1) {
      if (caretPosition < newPosition) newPosition -= 1
      setExpressions(oldExpression => {
        const exps = oldExpression.filter(exp => exp.type !== 'caret')
        exps.splice(newPosition, 0, createExpressionToken('caret', { content: '' }))
        return exps
      })
      setCaretPosition(newPosition)
    } else if (side === 'after' && caretPosition !== newPosition + 1) {
      newPosition += 1
      if (caretPosition < newPosition) newPosition -= 1
      setExpressions(oldExpression => {
        const exps = oldExpression.filter(exp => exp.type !== 'caret')
        exps.splice(newPosition, 0, createExpressionToken('caret', { content: '' }))
        return exps
      })
      setCaretPosition(newPosition)
    }
  }

  /* Input Click action for Specified caret Position */
  const inputClickAction = (event) => {
    const newPosition = event.target.selectionStart
    setCaretPosition(newPosition)
  }

  /* Calculator Field Click Action For Specified Caret Position */
  const fieldClickAction = (e) => {
    const clickX = e.pageX
    const clickY = e.pageY

    if (e.target.classList.contains('calculator-field')) {
      const expField = e.target
      const expFieldChild = expField.children

      if (expField.children.length > 1) {
        let i = 0
        for (i = 0; i < expFieldChild.length; i += 1) {
          const rect = expFieldChild[i].getBoundingClientRect()

          if (clickY > rect.y + rect.height) continue

          if (clickX < (rect.x)) {
            moveCaret(i, 'straight')
            break
          } else if (expFieldChild[i + 1]) {
            const rectNext = expFieldChild[i + 1].getBoundingClientRect()
            if (rectNext.y > rect.y + rect.height) {
              moveCaret(i + 1, 'straight')
              break
            }
          }
        }
        if (i === expFieldChild.length) {
          moveCaret(i - 1, 'straight')
        }
      }
    } else {
      const { target } = e
      const expFieldChild = target.parentElement.children

      for (let i = 0; i < expFieldChild.length; i += 1) {
        if (expFieldChild[i] === target) {
          const rect = target.getBoundingClientRect()
          const mid = (rect.width / 2)
          if (clickX > (mid + rect.x)) {
            moveCaret(i, 'after')
            break
          } else {
            moveCaret(i, 'before')
            break
          }
        }
      }
    }
  }

  /* Click Action For keyboard button/Field click */
  const keyboardClickAction = (id, btnType, dataObj, valueLength) => {
    if (btnType === 'clear') {
      setExpressions([])
      setCaretPosition(0)
      onChange('')
      return
    }
    if (expressions.length === 0) {
      if (btnType === 'back' && value) {
        onChange(value.slice(0, caretPosition - 1) + value.slice(caretPosition))
        setCaretPosition(oldPosition => oldPosition - (valueLength || 1))
      } else if (btnType !== 'field' && btnType !== 'back') {
        const newValue = value.slice(0, caretPosition) + dataObj.content + value.slice(caretPosition)
        setCaretPosition(oldPosition => oldPosition + (valueLength || 1))
        onChange(newValue)
      } else {
        const newValue = `${value.slice(0, caretPosition)}\${${dataObj.content}}${value.slice(caretPosition)}`
        const newExp = initialExpression(newValue, fieldArr, createExpressionToken)
        setExpressions(newExp)
        setCaretPosition(oldPosition => oldPosition + (valueLength || 1))
      }
    } else if (btnType === 'back') {
      if (caretPosition > 0) {
        setExpressions(oldExpression => oldExpression.slice(0, caretPosition - 1).concat(oldExpression.slice(caretPosition)))
        setCaretPosition(oldPosition => oldPosition - (valueLength || 1))
      }
    } else if (dataObj.isFunction) {
      const functionDataObj = {
        ...dataObj,
        content: dataObj.content.slice(0, dataObj.content.indexOf('(')),
      }
      setExpressions(oldExpression => oldExpression.slice(0, caretPosition).concat(
        [
          createExpressionToken(btnType, functionDataObj),
          createExpressionToken('operator', { content: '(' }),
        ],
        oldExpression.slice(caretPosition, caretPosition + 1),
        [createExpressionToken('operator', { content: ')' })],
        oldExpression.slice(caretPosition + 1),
      ))
      setCaretPosition(oldPosition => oldPosition + (valueLength || 2))
    } else {
      setExpressions(oldExpression => oldExpression.slice(0, caretPosition).concat([createExpressionToken(btnType, dataObj)], oldExpression.slice(caretPosition)))

      setCaretPosition(oldPosition => oldPosition + (valueLength || 1))
    }
    setTimeout(() => expRef.current?.focus(), 0)
  }

  return (
    <div className={`${css(style.wrp)} calculator-field-wrp`}>
      {
        enableCalculator && (
          <div
            className={`${css(style.calculateField)} calculator-field`}
            role="textbox"
            ref={expRef}
            onClick={fieldClickAction}
            onKeyDown={keyPressAction}
            onFocus={onFocusInAction}
            onBlur={onFocusOutAction}
            tabIndex={0}
          >
            {
              expressions.map((expElemnet) => (
                expElemnet && (
                  <span key={`sp-${expElemnet.id}`} className={`${css(style[expElemnet.type])} ${expElemnet.dataObj.isFunction ? css(style.function) : ''}`}>
                    {expElemnet.dataObj.label || expElemnet.dataObj.content}
                    {expElemnet.type === 'caret' && (<span className="caret" />)}
                  </span>
                )
              ))
            }
          </div>
        )
      }
      {
        !enableCalculator && (
          <MtInput
            label={label}
            type={type}
            disabled={disabled}
            onChange={e => onChange(e.target.value)}
            onKeyUp={inputKeyPressAction}
            onClick={inputClickAction}
            value={value}
            textarea={textarea}
            className={`${className} cal-fld-inp`}
          />
        )
      }
      <Tippy
        trigger="click"
        theme="light"
        maxWidth="520px"
        onShow={() => {
          setKeyboardActive(true)
          expRef.current?.focus()
        }}
        onHidden={() => {
          setKeyboardActive(false)
          expRef.current !== document.activeElement && setExpressions(preExp => preExp.filter(exp => exp?.type !== 'caret'))
        }}
        // hideOnClick="false"
        p="5px"
        distance="400"
        interactive
        content={(
          <KeyBoard
            clickAction={keyboardClickAction}
            options={options}
            formFields={formFields}
          />
        )}
      >
        <span className={css(style.dotOpt)}>
          <BdrDottedIcn size="15" rotateDeg={90} />
        </span>
      </Tippy>
    </div>
  )
}

export default CalculatorField

function initialExpression(value, fieldArr, createExpressionToken) {
  const expArr = []
  if (/\${\w[^ ${}]*}|^\(/g.test(value)) {
    const tempArr = value.match(/\${\w[^ ${}]*}|\d|\D/g)
    tempArr?.map((content) => {
      if (/^\s{1}/g.test(content)) {
        expArr.push(createExpressionToken('space', { content }))
      } else if (/^([A-Z]|[a-z]){1}\b/g.test(content)) {
        expArr.push(createExpressionToken('letters', { content }))
      } else if ((!isNaN(content)) || content === '.') {
        expArr.push(createExpressionToken('number', { content }))
      } else if (/^[+\-*/(),<>]{1}$/g.test(content)) {
        expArr.push(createExpressionToken('operator', { content }))
      } else if (/^[!@#$%^&*()\\=,.?"':{}[\]|_<>]$/g.test(content)) {
        expArr.push(createExpressionToken('symbol', { content }))
      } else if (/\${\w[^]*[\d\D\s]\)}/g.test(content)) {
        let functionName = content.replace(/^\${|}$/g, '')
        const params = functionName.slice(functionName.indexOf('('))
        functionName = functionName.replace(/\([ \d\D]*\)/g, '()')

        const smartTag = SmartTagField.find(fld => fld.name === functionName)
        functionName = functionName.replace(/\([ \d\D]*\)/g, '')
        expArr.push(createExpressionToken('field', { label: smartTag?.label, content: functionName, isFunction: true }))

        expArr.push(...initialExpression(params, fieldArr, createExpressionToken))
      } else if (/\${\w[^ ${}]*}/g.test(content)) {
        const fldKey = content.replace(/^\${|}$/g, '')
        const fldData = fieldArr.find(fld => fld.key === fldKey)
        if (fldData) {
          expArr.push(createExpressionToken('field', { label: fldData?.name, content: fldData?.key }))
        } else {
          const smartTag = SmartTagField.find(fld => fld.name === fldKey)
          if (smartTag) expArr.push(createExpressionToken('field', { label: smartTag?.label, content: smartTag?.name }))
          else expArr.push(createExpressionToken('field', { label: 'Separator', content }))
        }
      }
    })
  }
  return expArr
}

const style = {
  wrp: {
    w: '100%',
    mnh: 38,
    h: 'auto',
    lh: 1.5,
    brs: 8,
    dy: 'flex',
    p: 0,
    mt: 5,
  },
  calculateField: {
    w: '100%',
    h: 'auto',
    p: 5,
    ta: 'left',
    b: '1px solid var(--gray-3)',
    brs: '8px 0px 0px 8px',
    dy: 'flex',
    rg: '3px',
    ai: 'center',
    jc: 'left',
    flxp: 'wrap',
    cur: 'text',
    ':focus-visible': { oe: 'none' },
    ':focus': {
      bcr: 'var(--b-50)',
      bs: '0 0 0 2px var(--b-50) inset',
    },
  },
  dotOpt: {
    dy: 'inline-flex',
    ai: 'center',
    bc: 'hsl(0deg 0% 85%)',
    p: 2,
    b: 'none',
    brs: '0px var(--bf-bdr-radius-sm) var(--bf-bdr-radius-sm) 0px',
    ':hover': { bc: 'hsl(0deg 0% 80%)' },
  },
  field: {
    p: '1px 7px',
    bc: '#E5E8FF',
    m: '0px 1px',
    dy: 'flex',
    lh: '1.4',
    ai: 'center',
    fs: '15px',
    jc: 'center',
    brs: '8px',
  },
  option: {
    p: '1px 7px',
    bc: '#e6e6e6',
    m: '0px 1px',
    dy: 'flex',
    lh: '1.4',
    ai: 'center',
    fs: '15px',
    jc: 'center',
    brs: '11px',
  },
  operator: {
    fs: '17px',
    fw: '600',
    p: '0px 1px',
  },
  space: {
    fs: '17px',
    fw: '600',
    p: '0px 3px',
  },
  function: {
    mr: '0px !important',
    brs: '8px 0px 0px 8px !important',
    bc: 'hsl(233deg 100% 90%)',
  },
  caret: {
    dy: 'inline-block',
    w: 0,
    pn: 'relative',
    h: '20px',
  },
}

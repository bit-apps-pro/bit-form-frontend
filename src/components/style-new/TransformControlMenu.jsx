/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-case-declarations */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
import { create } from 'mutative'
import { memo } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { useAtom, useAtomValue } from 'jotai'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import TrashIcn from '../../Icons/TrashIcn'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import { ucFirst } from '../../Utils/Helpers'
import SizeControl from '../CompSettings/StyleCustomize/ChildComp/SizeControl'
import CssPropertyList from './CssPropertyList'
import { assignNestedObj, getNumFromStr, getStrFromStr, getValueByObjPath, unitConverter } from './styleHelpers'

function TransformControlMenu({ propertyPath, id }) {
  const title = 'Transform'
  const { css } = useFela()
  const { fieldKey, element } = useParams()
  const themeVars = useAtomValue($themeVars)
  const [styles, setStyles] = useAtom($styles)
  let checkImportant = ''
  const getTransformStyleVal = () => {
    let transformValue = getValueByObjPath(styles, propertyPath)

    if (transformValue?.match(/var/gi)?.[0] === 'var') {
      const themeVarTransition = transformValue?.replace(/\(|var|,.*|\)/gi, '')
      transformValue = themeVars[themeVarTransition]
    }
    if (transformValue?.match(/(!important)/gi)?.[0]) {
      checkImportant = '!important'
      transformValue = transformValue?.replace(/(!important)/gi, '')
    }
    return transformValue
  }
  const splitMultipleTransform = (transformString) => (transformString && transformString?.split(/(?!\(.*)\s(?![^(]*?\))/gi)) || []
  const arrOfTransformStr = splitMultipleTransform(getTransformStyleVal())
  const arrOfExtractedTransformObj = extractTransformValuesArr(arrOfTransformStr)
  const transformNameArr = arrOfExtractedTransformObj.map(transformObj => transformObj.name)
  const availableTransformVal = Object.keys(transformProps).filter(itm => !transformNameArr.includes(itm))

  const newTransformVal = (name, val, unit) => {
    val = `${name}(${val}${unit})`
    return val
  }

  const generateTransformValue = (name, { value, unit }, indx) => {
    const newTransitionStyle = newTransformVal(name, value, unit)

    arrOfTransformStr[indx] = newTransitionStyle
    let tnArrToStr = arrOfTransformStr.join(' ')

    if (checkImportant) {
      tnArrToStr = `${tnArrToStr} !important`
    }
    setStyles(prvStyles => create(prvStyles, drftStyles => {
      assignNestedObj(drftStyles, propertyPath, tnArrToStr)
    }))
    addToBuilderHistory(generateHistoryData(element, fieldKey, propertyPath, arrOfTransformStr.join(' '), { styles: getLatestState('styles') }))
  }

  const addTransitionHandler = (name) => {
    const getOldTransform = getTransformStyleVal()
    const val = getOldTransform === undefined || getOldTransform === ''
      ? newTransformVal(name, 0, transformProps[name].unit[0])
      : `${getOldTransform} ${newTransformVal(name, 0, transformProps[name].unit[0])}${checkImportant}`
    setStyles(prvStyle => create(prvStyle, drftStyles => {
      assignNestedObj(drftStyles, propertyPath, val)
    }))
    addToBuilderHistory(generateHistoryData(element, fieldKey, propertyPath, val, { styles: getLatestState('styles') }))
  }

  const deleteTransform = (indx) => {
    const getOldTransform = getTransformStyleVal()
    const transformArr = splitMultipleTransform(getOldTransform)
    if (transformArr.length === 1) return
    transformArr.splice(indx, 1)
    setStyles(prvStyle => create(prvStyle, drftStyles => {
      assignNestedObj(drftStyles, propertyPath, transformArr.join(' '))
    }))
    addToBuilderHistory(generateHistoryData(element, fieldKey, propertyPath, transformArr.join(' '), { styles: getLatestState('styles') }))
  }

  const sizeHandler = (v, prop, indx, prvUnit) => {
    const { unitKey: unit, unitValue: val } = v
    const value = unitConverter(unit, val, prvUnit)
    generateTransformValue(prop, { value, unit }, indx)
  }

  const getValue = (transObj, val) => (transObj?.name ? transformProps?.[transObj?.name][getStrFromStr(transObj.value)]?.[val] : '')

  return (
    <>
      <div className={css(ut.flxcb, ut.mb1)}>
        <span className={css(ut.fs12, ut.fs12, ut.fw500)}>{title}</span>
        {availableTransformVal.length > 0 && (
          <CssPropertyList
            id="transform-prop"
            properties={availableTransformVal}
            setProperty={addTransitionHandler}
            classNames={css({ mt: '0px !important' })}
          />
        )}
      </div>
      <div className={css(c.overFlowScroll)}>
        {arrOfExtractedTransformObj.map((transformObj, indx) => (
          <div key={`transformObj-${indx * 5}`} className={css(ut.p1, c.containerHover, arrOfExtractedTransformObj.length === 1 && { mnh: 90 })}>
            <div className={css(ut.flxcb, ut.mt1)}>
              <span className={css(ut.flxcb, ut.fs12, ut.fw500)}>
                {arrOfExtractedTransformObj.length > 1 && (
                  <button
                    data-testid={`${id}-del-btn-${indx}`}
                    onClick={() => deleteTransform(indx)}
                    className={`${css(ut.stylePropDeleteBtn)} delete-btn`}
                    type="button"
                  >
                    <TrashIcn />
                  </button>
                )}
                <span className={css({ ml: 20 })}>
                  {ucFirst(transformObj.name)}
                </span>
              </span>
              <SizeControl
                width="100px"
                value={Number(getNumFromStr(transformObj.value) || 0)}
                unit={getStrFromStr(transformObj.value) || ''}
                inputHandler={valObj => generateTransformValue(transformObj.name, valObj, indx)}
                sizeHandler={(v) => sizeHandler(v, transformObj.name, indx, getStrFromStr(transformObj.value))}
                options={transformObj?.name ? transformProps?.[transformObj?.name]?.unit : ''}
                min={getValue(transformObj, 'min') || ''}
                max={getValue(transformObj, 'max') || ''}
                step={getValue(transformObj, 'step') || ''}
                dataTestId={`${id}-input-${indx}`}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default memo(TransformControlMenu)

const extractTransformValuesArr = (arrOfTransformStr) => {
  const transformArr = arrOfTransformStr.map(transform => {
    if (!transform) return { name: 'perspective', value: '10px' }
    const [prop, val] = transform.split(/\(|\)/gi)
    return { name: prop, value: val }
  })
  return transformArr
}

const translate = {
  unit: ['px', '%'],
  px: { min: 1, max: 100, step: 1 },
  '%': { min: 1, max: 200, step: 1 },
}
const scale = {
  unit: [''],
  '': { min: '', max: '', step: '' },
}
const skew = {
  unit: ['deg', 'rad', 'turn'],
  // '': { min: '', max: '', step: '' },
  deg: { min: 1, max: 360, step: 1 },
  turn: { min: 0.1, max: 10, step: 0.1 },
  rad: { min: '', max: '', step: 0.1 },
}

const transformProps = {
  perspective: {
    unit: ['px', 'rem', 'cm'],
    px: { min: 1, max: 1000, step: 1 },
    rem: { min: 0.1, max: 500, step: 0.1 },
    cm: { min: 1, max: 500, step: 1 },
  },
  rotate: {
    unit: ['deg', 'turn', 'rad'],
    deg: { min: 1, max: 360, step: 1 },
    turn: { min: 0.1, max: 10, step: 0.1 },
    rad: { min: '', max: '', step: 0.1 },
  },
  translateX: { ...translate },
  translateY: { ...translate },
  translateZ: { ...translate },
  scaleX: { ...scale },
  scaleY: { ...scale },
  scaleZ: { ...scale },
  skewX: { ...skew },
  skewY: { ...skew },
}

const c = {
  containerHover: {
    pn: 'relative',
    '&:hover .delete-btn': { tm: 'scale(1.1)' },
  },
  accordionHead: {
    w: 220,
    p: 3,
    fw: 500,
    brs: 8,
    fs: 12,
  },
  divider: { bb: '1px solid var(--white-0-83)', mx: 3, my: 3 },
  footer: { flx: 'center', m: 5 },
  addBtn: {
    se: 25,
    b: 'none',
    brs: '50%',
    p: 0,
    flxi: 'center',
    bd: 'var(--white-0-95)',
    curp: 1,
    tn: 'transform 0.2s',
    ':hover': { tm: 'scale(1.1)', cr: 'var(--b-50)' },
    ':active': { tm: 'scale(0.95)' },
  },
  input: {
    fs: 14,
    fw: 500,
    w: '100%',
    h: 35,
    bd: 'var(--b-79-96) !important',
    oe: 'none !important',
    mx: 'auto',
    dy: 'block',
    lh: '2 !important',
    px: 8,
    mt: 10,
    mb: 3,
    bs: 'none !important',
    brs: '8px !important',
    tn: 'box-shadow .3s',
    b: '1px solid #e6e6e6 !important',
    '::placeholder': { cr: 'hsl(215deg 16% 57%)', fs: 12 },
    ':focus': { bs: '0 0 0 1px var(--b-50) !important', bcr: 'var(--b-50)!important' },
  },
  overFlowScroll: { owx: 'scroll', mxh: 200 },
}

/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-param-reassign */
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { $frontendTable, $updateTblBtn } from '../../../GlobalStates/GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import TxtAlignCntrIcn from '../../../Icons/TxtAlignCntrIcn'
import TxtAlignLeftIcn from '../../../Icons/TxtAlignLeftIcn'
import TxtAlignRightIcn from '../../../Icons/TxtAlignRightIcn'
import { ucFirst } from '../../../Utils/Helpers'
import { staticFontStyleVariants, staticFontweightVariants } from '../../../Utils/StaticData/fontvariant'
import { __ } from '../../../Utils/i18nwrap'
import Grow from '../../../components/CompSettings/StyleCustomize/ChildComp/Grow'
import SimpleDropdown from '../../../components/Utilities/SimpleDropdown'
import StyleSegmentControl from '../../../components/Utilities/StyleSegmentControl'
import CssPropertyList from '../../../components/style-new/CssPropertyList'
import BorderControlUtil from '../../../components/style-new/util-components/BorderControlUtil'
import ColorPickerUtil from '../../../components/style-new/util-components/ColorPickerUtil'
import SizeControlUtil from '../../../components/style-new/util-components/SizeControlUtil'
import SpaceControl from './SpaceControl'
import tableStyles from './StyleMapping'

export default function TableStyleProperties({ styleLayer, clsNameKey, states }) {
  const [clsKey, setClsKey] = useState(clsNameKey)
  const addableCssPropsObj = tableStyles[styleLayer]
  const [frontendTable, setFrontendTable] = useAtom($frontendTable)
  const { css } = useFela()
  const existCssPropsObj = frontendTable.table_styles.style?.[clsKey]
  const existCssPropsKey = Object.keys(existCssPropsObj || {})
  const [stateController, setStateController] = useState('')
  const setUpdateTblBtn = useSetAtom($updateTblBtn)

  const options = [
    { label: 'Default', icn: 'Default', show: ['icn'], tip: 'Default Style' },
  ]

  if (states) {
    Object.keys(states)?.map(state => {
      const stateLabel = state ? ucFirst(state) : 'Default'
      options.push({ label: stateLabel, icn: stateLabel, show: ['icn'], tip: `${stateLabel} Style` })
    })
  }

  const setController = lblName => {
    if (lblName === 'Default') {
      setStateController('')
      setClsKey(clsNameKey)
    } else {
      setStateController(lblName)
      setClsKey(`${clsNameKey}${states[lblName]}`)
    }
  }

  Object.entries(addableCssPropsObj || {}).forEach(([prop, propObj]) => {
    if (typeof propObj === 'object' && !existCssPropsKey?.includes(prop)) {
      if (Object.keys(propObj).find(propName => existCssPropsKey.includes(propName))) existCssPropsKey.push(prop)
    }
  })

  const availableCssProp = Object.keys(addableCssPropsObj).filter(prop => !existCssPropsKey.includes(prop))

  const setNewCssProp = (prop) => {
    setFrontendTable(preState => create(preState, drft => {
      drft.table_styles.style[clsKey][prop] = ''
    }))
    setUpdateTblBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const inputHandler = (prop, value) => {
    setFrontendTable(prvState => create(prvState, drft => {
      drft.table_styles.style[clsKey][prop] = value
    }))
    setUpdateTblBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  // const spacingHandler = (value, prop) => {
  //   setFrontendTable(prvState => create(prvState, drft => {
  //     drft.table_styles.style[clsKey][prop] = value
  //   }))
  // }

  const borderChangeHandler = (obj) => {
    setFrontendTable(prvState => create(prvState, drft => {
      Object.keys(obj).forEach((prop) => {
        drft.table_styles.style[clsKey][prop] = obj[prop]
      })
    }))
  }

  const propDel = (propName) => () => {
    setFrontendTable(prvState => create(prvState, drft => {
      delete drft.table_styles.style[clsKey][propName]
    }))
  }

  const getCssProperty = (propName) => {
    const borderObj = {}
    if (propName === 'border') {
      borderObj['border-style'] = existCssPropsObj?.['border-style']
      borderObj['border-color'] = existCssPropsObj?.['border-color']
      borderObj['border-width'] = existCssPropsObj?.['border-width']
      borderObj['border-radius'] = existCssPropsObj?.['border-radius']
    }

    switch (propName) {
      case 'background':
      case 'background-color':
        return (
          <>
            <span>{__('Background color')}</span>
            <div className={css({ flx: 'center-between' })}>
              <ColorPickerUtil
                id="caption"
                allowImage={false}
                allowVariable={false}
                allowGradient={false}
                // allowSolid={false}
                value={existCssPropsObj?.[propName] || ''}
                onChangeHandler={(obj) => inputHandler(propName, obj.color)}
              />
              <button
                type="button"
                onClick={propDel(propName)}
                className={`${css(proStyle.propsDelBtn)} delete-btn`}
              >
                <TrashIcn size="20" />
              </button>
            </div>
          </>
        )
      case 'color':
        return (
          <>
            <span>{__('Color')}</span>
            <div className={css({ flx: 'center-between' })}>
              <ColorPickerUtil
                allowImage={false}
                allowVariable={false}
                allowGradient={false}
                id="caption"
                value={existCssPropsObj?.[propName]}
                onChangeHandler={(obj) => inputHandler(propName, obj.color)}
              />
              <button
                type="button"
                onClick={propDel(propName)}
                className={`${css(proStyle.propsDelBtn)} delete-btn`}
              >
                <TrashIcn size="20" />
              </button>
            </div>
          </>
        )
      case 'margin':
        return (
          <>
            <span>{__('Margin')}</span>
            <div className={css({ flx: 'center-between' })}>
              <SpaceControl
                id="Margin"
                value={existCssPropsObj?.[propName]}
                onChangeHandler={value => inputHandler(propName, value)}
              />
              <button
                type="button"
                onClick={propDel(propName)}
                className={`${css(proStyle.propsDelBtn)} delete-btn`}
              >
                <TrashIcn size="20" />
              </button>
            </div>
          </>
        )
      case 'padding':
        return (
          <>
            <span>{__('Padding')}</span>
            <div className={css({ flx: 'center-between' })}>
              <SpaceControl
                id="padding"
                value={existCssPropsObj?.[propName]}
                onChangeHandler={value => inputHandler(propName, value)}
              />
              <button
                type="button"
                onClick={propDel(propName)}
                className={`${css(proStyle.propsDelBtn)} delete-btn`}
              >
                <TrashIcn size="20" />
              </button>
            </div>
          </>
        )
      case 'font-weight':
        return (
          <>
            <span>{__('Font Weight')}</span>
            <div className={css({ flx: 'center-between' })}>
              <SimpleDropdown
                options={staticFontweightVariants}
                value={String(existCssPropsObj?.[propName])}
                onChange={val => inputHandler(propName, val)}
                w={130}
                h={30}
                id="fld-font-weight"
              />
              <button
                type="button"
                onClick={propDel(propName)}
                className={`${css(proStyle.propsDelBtn)} delete-btn`}
              >
                <TrashIcn size="20" />
              </button>
            </div>
          </>
        )
      case 'font-style':
        return (
          <>
            <span>{__('Font Style')}</span>
            <div className={css({ flx: 'center-between' })}>
              <SimpleDropdown
                options={staticFontStyleVariants}
                value={String(existCssPropsObj?.[propName])}
                onChange={val => inputHandler(propName, val)}
                w={130}
                h={30}
                id="fld-font-style"
              />

              <button
                type="button"
                onClick={propDel(propName)}
                className={`${css(proStyle.propsDelBtn)} delete-btn`}
              >
                <TrashIcn size="20" />
              </button>
            </div>
          </>
        )
      case 'text-align':
        return (
          <>
            <span>{__('Text Align')}</span>
            <div className={css({ flx: 'center-between' })}>
              <StyleSegmentControl
                className={css({ w: 130 })}
                show={['icn']}
                tipPlace="bottom"
                options={[
                  { icn: <TxtAlignLeftIcn size="17" />, label: 'left', tip: 'Left' },
                  { icn: <TxtAlignCntrIcn size="17" />, label: 'center', tip: 'Center' },
                  { icn: <TxtAlignRightIcn size="17" />, label: 'right', tip: 'Right' },
                ]}
                onChange={val => inputHandler(propName, val)}
                defaultActive={existCssPropsObj?.[propName] || 'left'}
              />
              <button
                type="button"
                onClick={propDel(propName)}
                className={`${css(proStyle.propsDelBtn)} delete-btn`}
              >
                <TrashIcn size="20" />
              </button>
            </div>
          </>
        )
      case 'border':
        return (
          <>
            <span>{__('Border')}</span>
            <div className={css({ flx: 'center-between' })}>
              <BorderControlUtil
                value={borderObj}
                onChangeHandler={(obj) => borderChangeHandler(obj)}
              />
              <button
                type="button"
                onClick={propDel(propName)}
                className={`${css(proStyle.propsDelBtn)} delete-btn`}
              >
                <TrashIcn size="20" />
              </button>
            </div>
          </>
        )
      case 'font-size':
        return (
          <>
            <span>{__('Font Size')}</span>
            <div className={css({ flx: 'center-between' })}>
              <SizeControlUtil
                className={css({ w: 130 })}
                onChangeHandler={(vl) => inputHandler(propName, vl)}
                value={existCssPropsObj?.[propName]}
                width="128px"
                dataTestId="fld-font-size"
                sliderWidth="200px"
              />
              <button
                type="button"
                onClick={propDel(propName)}
                className={`${css(proStyle.propsDelBtn)} delete-btn`}
              >
                <TrashIcn size="20" />
              </button>
            </div>
          </>
        )
      case 'width':
        return (
          <>
            <span>{__('Width')}</span>
            <div className={css({ flx: 'center-between' })}>
              <SizeControlUtil
                className={css({ w: 130 })}
                onChangeHandler={(vl) => inputHandler(propName, vl)}
                value={existCssPropsObj?.[propName]}
                width="128px"
                dataTestId="table-width"
                sliderWidth="200px"
              />
              <button
                type="button"
                onClick={propDel(propName)}
                className={`${css(proStyle.propsDelBtn)} delete-btn`}
              >
                <TrashIcn size="20" />
              </button>
            </div>
          </>
        )
      default:
        break
    }
  }

  return (
    <>
      {options.length > 1 && (
        <StyleSegmentControl
          square
          noShadow
          defaultActive="Default"
          options={options}
          size={60}
          component="button"
          onChange={lbl => setController(lbl)}
          show={['icn']}
          variant="lightgray"
          width="100%"
          wideTab
        />
      )}
      <Grow overflw="" open={stateController.toLowerCase() === ''}>
        {
          existCssPropsKey.map((propName, index) => {
            const prop = getCssProperty(propName)
            if (!prop) return null
            return (
              <div key={`css-prop-${index * 5}`} className={css(proStyle.main)}>
                {prop}
              </div>
            )
          })
        }
      </Grow>

      {states && Object.keys(states)?.map((state, index) => (
        <Grow overflw="" open={stateController.toLowerCase() === state.toLowerCase()} key={`css-prop-${index * 5}`}>
          {
            existCssPropsKey.map((propName, indx) => {
              const prop = getCssProperty(propName)
              if (!prop) return null
              return (
                <div key={`css-prop-${indx * 5}`} className={css(proStyle.main)}>
                  {getCssProperty(propName)}
                </div>
              )
            })
          }
        </Grow>
      ))}
      {(availableCssProp.length > 0)
        && (
          <CssPropertyList
            id="individual-style"
            properties={availableCssProp}
            setProperty={(prop) => setNewCssProp(prop)}
          />
        )}
    </>
  )
}

const proStyle = {
  main: {
    flx: 'center-between',
    p: '5px 15px',
    '&:hover .delete-btn': { tm: 'scale(1)' },
  },
  propsDelBtn: {
    se: 20,
    flx: 'center',
    b: 'none',
    p: 0,
    mr: 1,
    tn: '.2s all',
    curp: 1,
    brs: '50%',
    ml: 10,
    tm: 'scale(0)',
    bd: 'none',
    cr: 'var(--red-100-61)',
    lt: -15,
    ':hover': { bd: '#ffd0d0', cr: '#460000' },
  },
}

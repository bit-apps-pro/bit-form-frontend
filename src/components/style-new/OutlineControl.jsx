/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $draggableModal } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import CloseIcn from '../../Icons/CloseIcn'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import ColorPreview from './ColorPreview'
import Important from './Important'
import { assignNestedObj, getObjByKey, getValueByObjPath, getValueFromStateVar, showDraggableModal } from './styleHelpers'

export default function OutlineControl({ subtitle, objectPaths, id, allowImportant, state, hslaPaths }) {
  const { css } = useFela()
  const { element, fieldKey } = useParams()
  const [draggableModel, setDraggableModal] = useAtom($draggableModal)
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const [themeColors, setThemeColors] = useAtom($themeColors)
  const [styles, setStyles] = useAtom($styles)

  /**
   * objectPaths is Array
   * 0 => themeVars
   * 1 => themeColors
   */

  let outlinePropsFirst
  let outlineClr
  let valueStr = ''

  const stateObj = (objName) => getObjByKey(objName, { themeVars, styles, themeColors })
  const getValue = (objectProp) => getValueFromStateVar(stateObj(objectProp.object), getValueByObjPath(stateObj(objectProp.object), objectProp.path))

  const propertiesObj = []

  if (Array.isArray(objectPaths)) {
    objectPaths.forEach((obj) => {
      const { paths, object } = obj
      const propKeys = Object.keys(obj.paths)
      propKeys.forEach((key) => {
        propertiesObj[key] = {
          object,
          path: paths[key],
        }
      })
    })
  } else {
    const { paths, object } = objectPaths
    const properties = Object.keys(paths)
    properties.forEach((prop) => {
      propertiesObj[prop] = {
        object,
        path: paths[prop],
      }
    })
  }

  const propertiesValue = {
    'outline-color': '',
    'outline-width': '',
    'outline-offset': '',
    'outline-style': '',
  }
  const propertiesKey = Object.keys(propertiesObj)
  for (let i = 0; i < propertiesKey.length; i += 1) {
    const prop = propertiesKey[i]
    if (propertiesKey.length === 2 && prop === 'outline') {
      const valStr = getValue(propertiesObj[prop])
      const val = valStr?.split(/(?!\(.*)\s(?![^(]*?\))/g)
      propertiesValue['outline-width'] = getValueFromStateVar(propertiesObj[prop], val[0]) || ''
      propertiesValue['outline-style'] = getValueFromStateVar(propertiesObj[prop], val[1]) || ''
      propertiesValue['outline-color'] = getValueFromStateVar(propertiesObj[prop], val[2]) || ''
      break
    }
    if (prop === 'outline-offset') continue
    propertiesValue[prop] = getValue(propertiesObj[prop])
  }
  propertiesValue['outline-offset'] = getValue(propertiesObj['outline-offset'])

  if (propertiesValue['outline-width']) valueStr += `Width: ${propertiesValue['outline-width']}; `
  if (propertiesValue['outline-style']) valueStr += `Style: ${propertiesValue['outline-style']}; `
  if (propertiesValue['outline-color']) {
    outlineClr = propertiesValue['outline-color']
    valueStr += `Color: ${propertiesValue['outline-color']}; `
  }

  const assignValues = (paths, obj, val = '') => {
    const propArray = Object.keys(paths)
    propArray.map(prop => {
      assignNestedObj(obj, paths[prop], val)
    })
  }
  const clearValue = () => {
    if (Array.isArray(objectPaths)) {
      objectPaths.map(obj => {
        const { paths } = obj
        if (obj.object === 'themeVars') {
          setThemeVars(prvThemeVars => create(prvThemeVars, drft => {
            assignValues(paths, drft)
          }))
        } else if (obj.object === 'themeColors') {
          setThemeColors(prvThemeColor => create(prvThemeColor, drft => {
            assignValues(paths, drft)
          }))
        }
      })
      addToBuilderHistory(generateHistoryData(element, fieldKey, 'outline Clear', '', { styles: getLatestState('styles') }))
    } else {
      const { paths } = objectPaths
      setStyles(prvState => create(prvState, drft => {
        assignValues(paths, drft)
      }))
      addToBuilderHistory(generateHistoryData(element, fieldKey, 'outline Clear', '', { styles: getLatestState('styles') }))
    }
  }
  console.log(objectPaths)
  return (
    <div className={css(ut.flxc)}>
      {allowImportant && valueStr && (
        <Important
          id={id}
          className={css({ mr: 3 })}
          paths={objectPaths.paths}
          propertyPath={outlinePropsFirst}
          stateObjName={objectPaths.object || 'styles'}
        />
      )}
      <div title={valueStr || 'Add outline Style'} className={css(c.preview_wrp, draggableModel.id === id && c.active)}>
        <button
          onClick={e => showDraggableModal(e, setDraggableModal, { component: 'outline-style', subtitle, objectPaths, state, id, hslaPaths })}
          type="button"
          className={css(c.pickrBtn)}
          data-testid={`${id}-modal-btn`}
        >
          <ColorPreview bg={outlineClr} h={24} w={24} className={css(ut.mr2)} />
          <span className={css(c.clrVal)}>{valueStr || 'Add outline Style'}</span>
        </button>
        {valueStr && (
          <button
            title="Clear Value"
            className={css(c.clearBtn)}
            onClick={clearValue}
            type="button"
            aria-label="Clear outline"
            data-testid={`${id}-clear-btn`}
          >
            <CloseIcn size="12" />
          </button>
        )}
      </div>
    </div>
  )
}

const c = {
  preview_wrp: {
    bd: 'var(--white-0-95)',
    w: 130,
    mnw: 130,
    brs: 'var(--bf-bdr-radius-sm)',
    p: 3,
    flx: 'center-between',
    ':hover': { bs: '0 0 0 1px var(--white-0-83)' },
  },
  preview: {
    w: 25,
    h: 25,
    b: '1px solid gray',
    brs: 7,
    curp: 1,
    mr: 7,
  },
  clearBtn: {
    brs: '50%',
    p: 4,
    w: 17,
    h: 17,
    b: 'none',
    flx: 'center',
    bd: 'transparent',
    cr: 'var(--white-0-50)',
    curp: 1,
    ':hover': { cr: 'var(--black-0)', bd: '#d3d1d1' },
  },
  pickrBtn: {
    b: 'none',
    curp: 1,
    flx: 'center',
    bd: 'transparent',
    p: 0,
  },
  clrVal: {
    w: 73,
    ws: 'nowrap',
    textOverflow: 'ellipsis',
    ow: 'hidden',
  },
  active: { focusShadow: 1 },
}

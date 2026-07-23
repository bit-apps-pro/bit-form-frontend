import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $draggableModal } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import CloseIcn from '../../Icons/CloseIcn'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import Important from './Important'
import ResetStyle from './ResetStyle'
import { assignNestedObj, getValueByObjPath, getValueFromStateVar, showDraggableModal } from './styleHelpers'

export default function SpacingControl({
  mainTitle, subtitle, action, value, objectPaths, id, allowImportant,
}) {
  const { css } = useFela()
  const { element, fieldKey } = useParams()
  const [draggableModal, setDraggableModal] = useAtom($draggableModal)
  const [styles, setStyles] = useAtom($styles)
  const [themeVars, setThemeVars] = useAtom($themeVars)

  const { object, paths } = objectPaths
  const margin = themeVars[paths?.margin]
  const padding = themeVars[paths?.padding]
  const val = getValueByObjPath(styles, paths?.margin || paths?.padding)

  const getValue = (m = 'M', p = 'P') => {
    let valu = ''
    if (objectPaths.object === 'themeVars') {
      if (margin) valu += `${m}: ${margin}; `
      if (padding) valu += `${p}: ${padding};`
    }
    if (valu === '' || valu === null) {
      valu = getValueFromStateVar(themeVars, val)
    }
    return valu || val
  }

  const clearHandler = () => {
    const pathKeys = Object.keys(paths)

    switch (object) {
      case 'styles':
        setStyles(prvStyle => create(prvStyle, drft => {
          pathKeys.map(prop => {
            assignNestedObj(drft, paths[prop], '')
          })
        }))
        addToBuilderHistory(generateHistoryData(element, fieldKey, `${paths?.margin || paths?.padding} Clear`, '', { styles: getLatestState('styles') }))
        break
      case 'themeVars':
        setThemeVars(preVars => create(preVars, drft => {
          pathKeys.map(prop => {
            assignNestedObj(drft, paths[prop], '')
          })
        }))
        addToBuilderHistory(generateHistoryData(element, fieldKey, `${paths?.margin || paths?.padding} Clear`, '', { themeVars: getLatestState('themeVars') }))
        break
      default:
        break
    }
  }

  return (
    <div className={css(ut.flxc, { cg: 3 })}>
      <ResetStyle id={id} propertyPath={Object.values(paths)} stateObjName={object} />
      {allowImportant && getValue() && (
        <Important
          propertyPath={paths?.margin || paths?.padding}
          stateObjName={object}
          id={id}
        />
      )}
      <div title={getValue('Margin', 'Padding') || 'Configure'} className={css(c.preview_wrp, draggableModal.id === id && c.active)}>
        <button
          onClick={e => showDraggableModal(e, setDraggableModal, {
            component: 'space-control', mainTitle, subtitle, action, value, objectPaths, id,
          })}
          type="button"
          className={css(c.pickrBtn)}
          data-testid={`${id}-modal-btn`}
        >
          {getValue() || 'Configure'}
        </button>
        {getValue('Margin', 'Padding') && (
          <button
            title="Clear Value"
            onClick={clearHandler}
            className={css(c.clearBtn)}
            type="button"
            aria-label="Clear Color"
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
    p: 7,
    pr: '3px !important',
    flx: 'center-between',
    h: 30,
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
    bd: 'transparent',
    ws: 'nowrap',
    to: 'ellipsis',
    p: 0,
    h: 28,
    w: 94,
    dy: 'block',
    ow: 'hidden',
    ta: 'start',
  },
  clrVal: {
    w: 90,
    ws: 'nowrap',
    textOverflow: 'ellipsis',
    ta: 'left',
    ow: 'hidden',
  },
  active: { focusShadow: 1 },
}

import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $draggableModal } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import CloseIcn from '../../Icons/CloseIcn'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import Important from './Important'
import { assignNestedObj, getValueByObjPath, getValueFromStateVar, showDraggableModal } from './styleHelpers'

export default function FilterController({ subtitle, action, value, objectPaths, id, allowImportant }) {
  const { css } = useFela()
  const { element, fieldKey } = useParams()
  const [draggableModal, setDraggableModal] = useAtom($draggableModal)
  const [styles, setStyles] = useAtom($styles)
  const [themeColors, setThemeColors] = useAtom($themeColors)

  const { object, paths } = objectPaths
  const val = getValueByObjPath(styles, paths?.filter)

  const getValue = () => {
    let valu = ''
    if (object === 'themeColors') {
      valu = themeColors[paths.filter]
    }
    if (valu === '' || valu === null) {
      valu = getValueFromStateVar(themeColors, val)
    }
    return valu
  }

  const clearHandler = () => {
    switch (object) {
      case 'styles':
        setStyles(prvStyle => create(prvStyle, drft => {
          assignNestedObj(drft, paths?.filter, '')
        }))
        addToBuilderHistory(generateHistoryData(element, fieldKey, `Clear ${paths?.filter}`, '', { styles: getLatestState('styles') }))
        break

      case 'themeColors':
        setThemeColors(prvThemeClr => create(prvThemeClr, drft => {
          assignNestedObj(drft, paths?.filter, '')
        }))
        addToBuilderHistory(generateHistoryData(element, fieldKey, `Clear ${paths?.filter}`, '', { themeColors: getLatestState('themeColors') }))
        break

      default:
        break
    }
  }

  return (
    <div className={css(ut.flxc, { cg: 3 })}>
      {allowImportant && getValue() && (<Important id={id} propertyPath={paths?.filter} stateObjName={object} />)}
      <div title={getValue() || 'Configure'} className={css(c.preview_wrp, draggableModal.id === id && c.active)}>
        <button
          onClick={e => showDraggableModal(e, setDraggableModal, {
            component: id, width: 250, subtitle, action, value, objectPaths, id,
          })}
          type="button"
          className={css(c.pickrBtn)}
          // title={val}
          data-testid={`${id}-model-btn`}
        >
          <span className={css(c.clrVal)}>{getValue() || 'Configure'}</span>
        </button>
        {getValue() && (
          <button
            title="Clear Value"
            onClick={clearHandler}
            className={css(c.clearBtn)}
            type="button"
            aria-label="Clear Filter"
            data-testid={`${id}-clear-btn`}
          >
            <CloseIcn size="10" />
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
    // pr: '1px !important',
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
    w: 80,
    ws: 'nowrap',
    textOverflow: 'ellipsis',
    ow: 'hidden',
    ta: 'left',
  },
  active: { focusShadow: 1 },
}

import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { $draggableModal } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import CloseIcn from '../../Icons/CloseIcn'
import ut from '../../styles/2.utilities'
import ColorPreview from './ColorPreview'
import Important from './Important'
import { assignNestedObj, getObjByKey, getValueByObjPath, showDraggableModal } from './styleHelpers'

export default function TextDecorationControl({ subtitle, value, objectPaths, id, allowImportant }) {
  const { css } = useFela()
  const setThemeColors = useSetAtom($themeColors)
  const [draggableModel, setDraggableModal] = useAtom($draggableModal)

  const [themeVars, setThemeVars] = useAtom($themeVars)
  const [styles, setStyles] = useAtom($styles)

  const stateObj = getObjByKey(objectPaths.object, { themeVars, styles })
  const { paths } = objectPaths

  const txtDcrtnValue = `${getValueByObjPath(stateObj, paths['text-decoration-line'])} ${getValueByObjPath(stateObj, paths['text-decoration-style'])} ${getValueByObjPath(stateObj, paths['text-decoration-thickness'])}`

  const clearValue = () => {
    switch (objectPaths.object) {
      case 'themeColors':
      case 'themeVars':
        setThemeVars(prvThemeVars => create(prvThemeVars, drft => {
          assignNestedObj(drft, paths['text-decoration-line'], '')
          assignNestedObj(drft, paths['text-decoration-style'], '')
          assignNestedObj(drft, paths['text-decoration-thickness'], '')
        }))
        setThemeColors(prvThemeColors => create(prvThemeColors, drft => {
          assignNestedObj(drft, paths['text-decoration-color'], '')
        }))
        break
      case 'styles':
        setStyles(prvState => create(prvState, drft => {
          Object.keys(paths).map(propPathKey => {
            assignNestedObj(drft, paths[propPathKey], '')
          })
        }))
        break
      default:
        break
    }
  }

  return (
    <div className={css(ut.flxc)}>
      {allowImportant && value && (
        <Important
          id={id}
          className={css({ mr: 3 })}
          propertyPath={paths['text-decoration-line']}
          stateObjName={objectPaths.object || 'styles'}
        />
      )}
      <div title={txtDcrtnValue} className={css(c.preview_wrp, draggableModel.id === id && c.active)}>
        <button
          onClick={e => showDraggableModal(e, setDraggableModal, { component: 'text-decoration', subtitle, objectPaths, id, width: 250 })}
          type="button"
          className={css(c.pickrBtn)}
          data-testid={`${id}-modal-btn`}
        >
          <ColorPreview
            bg={getValueByObjPath(stateObj, paths['text-decoration-color'])?.replace(/!important/gi, '')}
            h={24}
            w={24}
            className={css(ut.mr2)}
          />
          <span className={css(c.clrVal)}>{txtDcrtnValue || 'Add Text Decoration Style'}</span>
        </button>
        {txtDcrtnValue && (
          <button
            title="Clear Value"
            className={css(c.clearBtn)}
            onClick={clearValue}
            type="button"
            aria-label="Clear TextDecoration"
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
    ta: 'left',
    ow: 'hidden',
  },
  active: { focusShadow: 1 },
}

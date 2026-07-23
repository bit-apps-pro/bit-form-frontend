/* eslint-disable no-param-reassign */
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { $draggableModal } from '../../GlobalStates/GlobalStates'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import CloseIcn from '../../Icons/CloseIcn'
import ut from '../../styles/2.utilities'
import ColorPreview from './ColorPreview'
import { showDraggableModal, splitValueBySpaces } from './styleHelpers'

export default function ShadowControl({ value, subtitle, objectPaths, id }) {
  const { css } = useFela()
  const setThemeColors = useSetAtom($themeColors)

  const colorVal = splitValueBySpaces(value)[4]
  const [draggableModal, setDraggableModal] = useAtom($draggableModal)
  const clearValue = () => {
    switch (objectPaths.object) {
      case 'themeColors':
        setThemeColors(prvColorVar => create(prvColorVar, drft => {
          drft[objectPaths.paths.shadow] = ''
        }))
        break

      default:
        break
    }
  }
  return (
    <div title={value || 'Add Shadow'} className={css(c.preview_wrp, draggableModal.id === id && c.active)}>
      <button
        onClick={e => showDraggableModal(e, setDraggableModal, { component: 'shadow-control', subtitle, objectPaths, id, width: 250 })}
        type="button"
        className={css(c.pickrBtn)}
        data-testid={`${id}-ctrl`}
      >
        <ColorPreview bg={colorVal} h={24} w={29} className={css(ut.mr2)} />
        <span className={css(c.clrVal)}>{value || 'Add Shadow'}</span>
      </button>
      {value && (
        <button
          className={css(c.clearBtn)}
          onClick={clearValue}
          type="button"
          aria-label="Clear Shadow"
          data-testid={`${id}-clear-btn`}
        >
          <CloseIcn size="12" />
        </button>
      )}
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
    pr: '3px !important',
    flx: 'center-between',
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
    w: '86%',
    pn: 'relative',
    b: 'none',
    curp: 1,
    flx: 'center',
    bd: 'transparent',
    p: 0,
  },
  clrVal: {
    w: 90,
    ws: 'nowrap',
    textOverflow: 'ellipsis',
    ow: 'hidden',
    ta: 'left',
  },
  active: { focusShadow: 1 },
}

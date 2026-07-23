import { useAtom, useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import { $draggableModal } from '../../GlobalStates/GlobalStates'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import { showDraggableModal } from './styleHelpers'

export default function FontPicker({ id }) {
  const { css } = useFela()
  const themeVars = useAtomValue($themeVars)
  const [draggableModal, setDraggableModal] = useAtom($draggableModal)

  const font = themeVars['--g-font-family']
  const fontName = font === 'inherit' ? 'Inherit' : font || 'Configure'
  return (
    <button
      className={css(c.preview_wrp, c.btn, draggableModal.id === id && c.active)}
      onClick={e => showDraggableModal(e, setDraggableModal, { component: 'font', id, width: 240 })}
      type="button"
      data-testid="font-picker"
      title={fontName}
    >
      {fontName.length > 15 ? `${fontName.slice(0, 15)}...` : fontName}
    </button>
  )
}

const c = {
  preview_wrp: {
    bd: 'var(--white-0-95)',
    w: 130,
    mnw: 130,
    brs: 'var(--bf-bdr-radius-sm)',
    px: 5,
    py: 3,
    flx: 'center-between',
    h: 30,
    fw: 500,
    ':hover': { bs: '0 0 0 1px var(--white-0-83)' },
    ta: 'left',
    pl: 5,
  },
  btn: { b: 'none', curp: 1, dy: 'block' },
  clrVal: {
    w: 70,
    textOverflow: 'ellipsis',
    ow: 'hidden',
    ta: 'left',
  },
  active: { focusShadow: 1 },
}

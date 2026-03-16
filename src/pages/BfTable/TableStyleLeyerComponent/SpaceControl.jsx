import { useFela } from 'react-fela'
import Downmenu from '../../../components/Utilities/Downmenu'
import BoxSizingUtil from '../../../components/style-new/util-components/BoxSizingUtil'
import ut from '../../../styles/2.utilities'

export default function SpaceControl({ value, id, onChangeHandler }) {
  const { css } = useFela()

  return (
    <div className={css(ut.flxc, { cg: 3 })}>
      <div title={value || 'Configure'} className={css(c.preview_wrp)}>
        <Downmenu
          onShow={() => { }}
          onHide={() => { }}
        >
          <button
            onClick="usjk"
            type="button"
            className={css(c.pickrBtn)}
            data-testid={`${id}-modal-btn`}
          >
            {value || 'Configure'}
          </button>
          <BoxSizingUtil
            value={value}
            className={css({ p: 5 })}
            onChangeHandler={onChangeHandler}
          />
        </Downmenu>
      </div>
    </div>
  )
}

const c = {
  preview_wrp: {
    bd: 'var(--white-0-95)',
    w: 130,
    mnw: 130,
    brs: 10,
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

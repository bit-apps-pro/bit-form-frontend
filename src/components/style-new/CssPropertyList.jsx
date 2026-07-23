import { useFela } from 'react-fela'
import CloseIcn from '../../Icons/CloseIcn'
import { ucFirst } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import Downmenu from '../Utilities/Downmenu'

export default function CssPropertyList({ properties, setProperty, classNames = '', id }) {
  const { css } = useFela()

  const decorateLabel = (label) => ucFirst(label.split('-').join(' '))

  return (
    <div className={`${css(s.wrp)} ${classNames}`}>
      <Downmenu>
        <button
          className={css(s.addBtn)}
          type="button"
          aria-label="Add Style Property"
          data-testid={`${id}-add-btn`}
        >
          <CloseIcn size="10" className={css({ tm: 'rotate(45deg)' })} />
          <span>{__(' Add Property')}</span>
        </button>
        <ul className={css(s.con)}>
          {properties?.sort()?.map((prop, indx) => (
            <li key={`css-property-list-${indx * 2}`} className={css(s.item)}>
              <button
                type="button"
                className={css(s.itemBtn)}
                onClick={() => setProperty(prop)}
                data-testid={`${id}-${prop}`}
              >
                {decorateLabel(prop)}
              </button>
            </li>
          ))}
        </ul>
      </Downmenu>
    </div>
  )
}
const s = {
  wrp: { mt: 10, flx: 'center', '& .tippy-content': { p: 0 } },
  addBtn: {
    cr: 'var(--bf-text-clr-dark)',
    mt: 'var(--bf-space-5)',
    b: '1px solid var(--bf-stroke-clr)',
    brs: 'var(--bf-bdr-radius-md)',
    p: '5px 10px',
    flxi: 'center',
    gp: 'var(--bf-space-4)',
    bd: 'var(--white-0-95)',
    curp: 1,
    tn: 'transform 0.2s',
    ':hover': {
      bd: 'var(--bf-bg-tertiary)',
      cr: 'var(--bf-text-clr-white)',
      fw: 'var(--bf-font-medium)',
    },
    ':focus-within': {
      bd: 'var(--bf-bg-tertiary)',
      cr: 'var(--bf-text-clr-white)',
      fw: 'var(--bf-font-medium)',
    },
    ':active': { tm: 'scale(0.95)' },
  },
  con: { m: 0, p: 4 },
  item: { dy: 'block', m: 0 },
  itemBtn: {
    m: 0,
    brs: 6,
    curp: 1,
    tn: 'background .3s',
    py: 3,
    px: 10,
    fw: 500,
    b: 'none',
    w: '100%',
    bd: 'none',
    ta: 'left',
    ':hover': { bd: 'var(--white-0-95)' },
  },
}

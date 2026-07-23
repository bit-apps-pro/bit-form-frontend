import { useEffect, useRef, useState } from 'react'
import { useFela } from 'react-fela'
import ChevronDownIcn from '../../Icons/ChevronDownIcn'
import ut from '../../styles/2.utilities'
import useComponentVisible from '../CompSettings/StyleCustomize/ChildComp/useComponentVisible'

export default function SimpleDropdown({
  options = [], value, cls, onChange = () => { }, placeholder = 'Select One', w = 150, h = 25, id,
}) {
  let defaultVal = null
  // const selected = options?.find(opt => opt.value === value)
  if (Number.isInteger(value)) {
    defaultVal = options?.[value]
  } else {
    defaultVal = options?.find(opt => opt.value === value) || {}
  }
  const { css } = useFela()
  const [menu, setMenu] = useState({ open: false, height: 0 })
  const [selectedItem, setSelectedItem] = useState(defaultVal)
  const optionWrpRef = useRef()
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)
  useEffect(() => {
    if (Number.isInteger(value)) {
      setSelectedItem(options?.[value])
    } else {
      const selected = options?.find(opt => opt.value === value)
      setSelectedItem(selected || {})
    }
  }, [value])

  // useEffect(() => {
  //   onChange(selectedItem)
  // }, [selectedItem])

  useEffect(() => {
    if (!isComponentVisible) {
      setMenu({ open: false, height: 0 })
    }
  }, [isComponentVisible])

  const handleMenu = (e) => {
    e.stopPropagation()
    if (menu.open) {
      setMenu({ height: 0, open: false })
    } else {
      const optionsHeight = optionWrpRef.current.children[0].offsetHeight
      setMenu({ height: optionsHeight, open: true })
      setIsComponentVisible(true)
    }
  }

  const handleOptionClick = (e, i) => {
    e.stopPropagation()
    setSelectedItem(options[i])
    if (onChange) onChange(options[i].value)
    setMenu({ height: 0, open: false })
  }

  const handleDropdownClick = (e) => {
    if (e.code === 'Escape') {
      setMenu({ height: 0, open: false })
    }
    if (e.code === 'Space' || e.code === 'Enter') {
      if (menu.open) {
        setMenu({ height: 0, open: false })
      } else {
        const optionsHeight = optionWrpRef.current.children[0].offsetHeight
        setMenu({ height: optionsHeight, open: true })
        setIsComponentVisible(true)
      }
      return
    }
    if (e.type === 'click') {
      if (menu.open) {
        setMenu({ height: 0, open: false })
      } else {
        const optionsHeight = optionWrpRef.current.children[0].offsetHeight
        setMenu({ height: optionsHeight, open: true })
        setIsComponentVisible(true)
      }
    }
  }

  return (
    <div className={css(simppleDpdStyle.dpd_wrp)} style={{ width: w, height: h, ...menu.open && { zIndex: 999 } }}>
      <div
        ref={ref}
        role="button"
        onClick={handleDropdownClick}
        onKeyUp={handleDropdownClick}
        tabIndex="0"
        className={`${menu.open && css(simppleDpdStyle.dpd_open)} ${css(simppleDpdStyle.dpd)} ${css({ w })} ${cls}`}
        data-testid={id}
      >
        <div className={css(simppleDpdStyle.selected)} style={{ height: h - 8 }}>
          <div className={css(ut.flxc)}>
            {selectedItem?.icn && <div className={css(simppleDpdStyle.selected_icn)}>{selectedItem.icn}</div>}
            <div>{selectedItem?.label || placeholder}</div>
          </div>
          <div
            className={css([simppleDpdStyle.down_btn, ut['g-c']])}
            style={{ height: h - 8 }}
          >
            <ChevronDownIcn size="18" rotate={menu.open} />
          </div>
        </div>
        <div
          ref={optionWrpRef}
          className={css(simppleDpdStyle.option_wrp)}
          style={{ height: menu.height }}
        >
          <ul className={css(simppleDpdStyle.options)} aria-hidden={!menu.open}>
            <div className={css(simppleDpdStyle.divider)} />
            {options && options.map((itm, i) => (
              <li key={`${itm.value}-${i * 9}`} className={css(simppleDpdStyle.option)}>
                <button
                  type="button"
                  tabIndex={menu.open ? 0 : -1}
                  onClick={(e) => handleOptionClick(e, i)}
                  onKeyDown={(e) => handleOptionClick(e, i)}
                  className={css(simppleDpdStyle.opt_btn)}
                  data-testid={`${id}-${itm.value}`}
                >
                  <i className={css(simppleDpdStyle.opt_icn)}>{itm.icn}</i>
                  {itm.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const simppleDpdStyle = {
  dpd_wrp: {
    dy: 'inline-block',
    pn: 'relative',
  },
  dpd: {
    ow: 'hidden',
    p: 3,
    brs: 'var(--bf-bdr-radius-sm)',
    pn: 'absolute',
    w: '100%',
    tn: 'box-shadow 0.2s',
    bd: 'var(--white-0-95)',
    tdy: '150ms',
    ':focus-visible': {
      bs: '0 0 0 1.5px var(--b-50) inset',
      oe: 'none',
    },
  },
  dpd_open: {
    tdy: '0s',
    bs: '0 0 0 0.5px var(--white-0-0-29) inset, #eaeaea 0px 3px 5px 0px, #d2d2d2 0px 5px 20px -9px;',
    bd: 'white',
  },
  selected_icn: { mr: 7 },
  selected: {
    fw: 500,
    flx: 'between',
    curp: 1,
    w: '96%',
    p: '0 5px',
    fs: 12,
  },
  option_wrp: { ow: 'hidden', tn: 'height 0.2s' },
  options: {
    p: 0,
    m: 0,
  },
  divider: {
    bt: '0.5px solid var(--white-0-86)',
    mb: 2,
  },
  option: {
    fs: 13,
    m: 0,
    flx: 'align-center',
    transition: 'background 0.3s',
    brs: 7,
    ':hover': { background: 'var(--white-0-89)' },
  },
  opt_btn: {
    brs: 7,
    fs: 12,
    curp: 1,
    ta: 'left',
    b: 'none',
    p: 3,
    w: '100%',
    h: '100%',
    bd: 'none',
    ':hover': { bd: 'transparent' },
    ':focus-visible': {
      bs: '0 0 0 1.5px var(--b-50) inset',
      oe: 'none',
    },
  },
  opt_icn: {
    mr: 7,
    h: 20,
    w: 20,
  },
  down_btn: {
    w: 25,
    h: 25,
    tn: 'transform 0.2s',
  },

}

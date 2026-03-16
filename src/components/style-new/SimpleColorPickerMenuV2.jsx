/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
import ColorPicker from '@atomik-color/component'
import { str2Color } from '@atomik-color/core'
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { memo, useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeColors } from '../../GlobalStates/ThemeColorsState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import ut from '../../styles/2.utilities'
import boxSizeControlStyle from '../../styles/boxSizeControl.style'
import Grow from '../CompSettings/StyleCustomize/ChildComp/Grow'
import StyleSegmentControl from '../Utilities/StyleSegmentControl'
import ColorPreview from './ColorPreview'
import { hsva2hsla } from './colorHelpers'

function SimpleColorPickerMenuV2({ action, value, objectPaths, canSetVariable }) {
  const { css } = useFela()
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const [color, setColor] = useState(() => str2Color(value?.replace('!important', '').trim()) || 'hsla(0, 0%, 100%, 100%)')
  const isColorVar = typeof color === 'string'
  const [controller, setController] = useState(isColorVar ? 'Var' : 'Custom')
  const [themeColors, setThemeColors] = useAtom($themeColors)
  const [styles, setStyles] = useAtom($styles)
  const options = [
    { label: 'Custom', icn: 'Custom color', show: ['icn'], tip: 'Custom color' },
    { label: 'Var', icn: 'Variables', show: ['icn'], tip: 'Variable color' },
  ]

  const { '--global-bg-color': themeBgColor,
    '--global-fld-bdr-clr': themeFldBdrClr,
    '--global-fld-bg-color': themeFldBgColor,
    '--global-font-color': themeFontColor,
    '--global-accent-color': themePrimaryColor } = themeColors

  const getCustomColor = () => {
    const colorValue = styles.fields[objectPaths.fk].classes[objectPaths.selector][objectPaths.property]
    if (colorValue === undefined) return 'hsla(0, 0%, 100%, 100%)'
    if (colorValue.match(/var/g)?.[0] === 'var') {
      const getVarProperty = colorValue.replace(/\(|var|,.*|\)/gi, '')
      return themeVars[getVarProperty]
    }
    return colorValue
  }

  useEffect(() => {
    if (isColorVar) return
    if (!action.type) return
    switch (action.type) {
      case 'global-accent-color':
      case 'global-font-color':
        return setColor(str2Color(themeColors['--global-font-color']))
      case 'global-fld-bdr-clr':
        return setColor(str2Color(themeColors['--global-fld-bdr-clr']))
      case 'individul-color':
        return setColor(str2Color(getCustomColor()))
      default:
        return setColor(str2Color(themeVars[`--${action.type}`]))
    }
  }, [action])

  const handleColor = () => {
    const [_h, _s, _l] = hsva2hsla(color.h, color.s, color.v)
    if (!action.type) return

    const h = Math.round(_h || 0)
    const s = Math.round(_s)
    const l = Math.round(_l)
    const a = color.a || 100

    const hsla = `hsla(${h}, ${s}%, ${l}%, ${a}%)`

    switch (action.type) {
      case 'global-accent-color':
        setThemeColors(prvState => create(prvState, drft => {
          drft['--global-accent-color'] = hsla
          drft['--gah'] = h
          drft['--gas'] = `${s}%`
          drft['--gal'] = `${l}%`
          drft['--gaa'] = `${a}%`
        }))
        break
      case 'global-font-color':
        setThemeColors(prvState => create(prvState, drft => {
          drft['--global-font-color'] = hsla
          drft['--gfh'] = Math.round(_h)
          drft['--gfs'] = `${s}%`
          drft['--gfl'] = `${l}%`
          drft['--gfa'] = `${a}%`
        }))
        break
      case 'global-bg-color':
        setThemeColors(prvState => create(prvState, drft => {
          drft['--global-bg-color'] = hsla
          drft['--gbg-h'] = Math.round(_h)
          drft['--gbg-s'] = `${s}%`
          drft['--gbg-l'] = `${l}%`
          drft['--gbg-a'] = `${a}%`
        }))
        break
      case 'global-fld-bdr-clr':
        setThemeColors(prvState => create(prvState, drft => {
          drft['--global-fld-bdr-clr'] = hsla
        }))
        break
      case 'global-fld-bg-color':
        setThemeColors(prvState => create(prvState, drft => {
          drft['--global-fld-bg-color'] = hsla
        }))
        break
      case 'fw-bg':
        setThemeColors(prvState => create(prvState, drft => {
          drft['--fld-wrp-bg'] = hsla
        }))
        break
      case 'individul-color':
        setStyles(prvStyle => create(prvStyle, drft => {
          drft.fields[objectPaths.fk].classes[objectPaths.selector][objectPaths.property] = hsla
        }))
        break
      default:
        return setThemeVars(prvState => create(prvState, drft => {
          drft[`--${action.type}`] = hsla
        }))
    }
  }

  const handleColorVar = () => {
    if (!action.type) return

    const colorVar = `var(${color})`

    switch (action.type) {
      case 'global-fld-bdr-clr':
        setThemeColors(prvState => create(prvState, drft => {
          drft['--global-fld-bdr-clr'] = colorVar
        }))
        break
      default:
        return setThemeVars(prvState => create(prvState, drft => {
          drft[`--${action.type}`] = colorVar
        }))
    }
  }

  useEffect(() => {
    if (isColorVar) {
      handleColorVar()
    } else if (color) {
      handleColor()
    }
  }, [color])

  const formatColorOnChange = clr => {
    let c = ''
    if (typeof clr === 'string') {
      c = `var(${clr})`
    } else {
      const [_h, _s, _l] = hsva2hsla(clr.h, clr.s, clr.v)
      c = `hsla(${Math.round(_h || 0)}, ${Math.round(_s)}%, ${Math.round(_l)}%, ${clr.a || 100}%)`
    }

    action.onChange(c)
  }

  const setColorState = (val) => {
    setColor(val)

    if (action.onChange) formatColorOnChange(val)
  }

  // useEffect(() => {
  //   if (!isColorVar) return

  // }, [colorVar])

  return (
    <div className={css(c.preview_wrp)}>
      {canSetVariable ? (
        <>
          <div className={css(boxSizeControlStyle.titlecontainer, c.mb)}>
            <StyleSegmentControl
              square
              noShadow
              defaultActive="Var"
              options={options}
              size={60}
              component="button"
              onChange={lbl => setController(lbl)}
              show={['icn']}
              variant="lightgray"
              width="100%"
              wideTab
            />
          </div>

          <Grow open={controller === 'Var'}>
            <div className={css(c.varClr)}>
              <button className={`${css(c.clrItem)} ${css(color === '--global-bg-color' && c.active)}`} type="button" onClick={() => setColorState('--global-bg-color')}>
                <ColorPreview bg={themeBgColor} className={css(ut.mr2)} />
                <span>Background Color</span>
              </button>
              <button className={css(c.clrItem, color === '--global-accent-color' && c.active)} type="button" onClick={() => setColorState('--global-accent-color')}>
                <ColorPreview bg={themePrimaryColor} className={css(ut.mr2)} />
                <span>Background Accent Color</span>
              </button>
              <button className={css(c.clrItem, color === '--global-font-color' && c.active)} type="button" onClick={() => setColorState('--global-font-color')}>
                <ColorPreview bg={themeFontColor} className={css(ut.mr2)} />
                <span>Font Color</span>
              </button>
              <button className={css(c.clrItem, color === '--global-fld-bdr-clr' && c.active)} type="button" onClick={() => setColorState('--global-fld-bdr-clr')}>
                <ColorPreview bg={themeFldBdrClr} className={css(ut.mr2)} />
                <span>Field Border Color</span>
              </button>
              <button className={css(c.clrItem, color === '--global-fld-bg-color' && c.active)} type="button" onClick={() => setColorState('--global-fld-bg-color')}>
                <ColorPreview bg={themeFldBgColor} className={css(ut.mr2)} />
                <span>Field Background Color</span>
              </button>
            </div>
          </Grow>

          <Grow open={controller === 'Custom'}>
            <ColorPicker showParams showPreview onChange={setColorState} value={color} />
          </Grow>
        </>
      ) : (
        <ColorPicker showParams showPreview onChange={setColorState} value={color} />
      )}
    </div>
  )
}

export default memo(SimpleColorPickerMenuV2)

const c = {
  preview_wrp: {
    '& div[role="group"]': { p: 4, b: 0 },
    '& input': {
      brs: 8,
      b: '1px solid lightgray',
      p: '3px 8px',
      mnh: '10px !important',
      fs: 12,
      mb: 3,
      bs: 'none',
      ':focus': { focusShadow: 1, b: '1px solid var(--b-50)' },
    },
    '& .common-module_transBackground__2AOKu': {
      brs: 8,
      ow: 'hidden',
    },
    mnw: 230,
    py: 5,
  },
  color: {
    w: 30,
    h: 30,
    brs: 8,
    mr: 10,
  },
  bggrid: { bi: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQYV2N89erVfwY0ICYmxoguxjgUFKI7GsTH5m4M3w1ChQC1/Ca8i2n1WgAAAABJRU5ErkJggg==)' },
  varClr: { my: 5 },
  active: { bcr: 'var(--b-50) !important', bd: '#f3f8ff' },
  clrItem: {
    dy: 'block',
    flx: 'align-center',
    bd: 'transparent',
    b: '2px solid var(--white-0-93)',
    p: 3,
    mb: 8,
    brs: 10,
    fs: 12,
    cur: 'pointer',
    w: '100%',
    tn: 'background .3s',
    ':hover': { bd: 'var(--white-0-97)' },
  },
  m: { mr: 15 },
  mb: { mb: 5 },
}

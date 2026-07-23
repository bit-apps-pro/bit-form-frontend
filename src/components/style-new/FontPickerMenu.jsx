/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useAtom, useAtomValue } from 'jotai'
import { $savedThemeVars } from '../../GlobalStates/SavedStylesAndVars'
import { $styles } from '../../GlobalStates/StylesState'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import AtoZSortIcn from '../../Icons/AtoZSortIcn'
import CheckMarkIcn from '../../Icons/CheckMarkIcn'
import SearchIcon from '../../Icons/SearchIcon'
import ut from '../../styles/2.utilities'
import { addToBuilderHistory, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import { sortByField } from '../../Utils/Helpers'
import SingleToggle from '../Utilities/SingleToggle'
import StyleSegmentControl from '../Utilities/StyleSegmentControl'
import VirtualList from '../Utilities/VirtualList'
import { findExistingFontStyleNWeight, generateFontUrl, isValidURL } from './styleHelpers'

const API_KEY = 'AIzaSyB9lRmRi8phfBLNMT3CpTF2DsWNLGfoFWY'
const URL = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`

export default function FontPickerMenu({ id }) {
  const { css } = useFela()
  const { fieldKey, element, formID } = useParams()
  const [fonts, setFonts] = useState([])
  const [isSorted, setSorted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [styles, setStyles] = useAtom($styles)
  const [focusSearch, setfocusSearch] = useState(false)
  const [controller, setController] = useState(styles.font.fontType || ('Custom' || 'inherit'))
  const [themeVars, setThemeVars] = useAtom($themeVars)
  const savedThemeVars = useAtomValue($savedThemeVars)

  const inheritFont = themeVars['--g-font-family'] === 'inherit'
  const fontSource = (styles.font.fontType === 'Google')

  useEffect(() => {
    if ('bf-fonts' in localStorage) {
      try {
        setFonts(JSON.parse(localStorage.getItem('bf-fonts')))
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    } else {
      fetch(URL)
        .then((res) => res.json())
        .then((data) => {
          setFonts(data.items)
          setLoading(false)
          localStorage.setItem('bf-fonts', JSON.stringify(data.items))
        })
    }
  }, [])

  const onTabChangeHandler = (lbl) => {
    setController(lbl)
  }

  const findSelectedFontIndx = () => (
    styles?.font?.fontType === 'Google'
      ? fonts.findIndex(itm => itm.family === themeVars['--g-font-family'])
      : 0
  )

  const searchHandler = (e) => {
    const { value } = e.target
    const oldFonts = JSON.parse(localStorage.getItem('bf-fonts'))
    const filtered = oldFonts.filter(font => font.family.toLowerCase().includes(value.toLowerCase()))
    setFonts(filtered)
  }

  const getGoogleFontWeightStyle = (array) => {
    const weight = []
    const style = ['normal']
    const param = []
    let string = ''

    for (let i = 0; i < array.length; i += 1) {
      const dig = array[i].match(/\d+/gi)?.[0]
      if (dig) {
        if (!weight.includes(Number(dig))) {
          weight.push(Number(dig))
          param.push(`0,${dig};`)
        }
      }
      if (array[i].match(/\d+\D+/gi)) {
        if (dig) {
          param.push(`1,${dig};`)
        }
        const str = array[i].match(/\D+/gi)?.[0]
        if (!style.includes(str)) {
          style.push(str)
        }
      }
      if (array[i] === 'regular') {
        param.push(...['0,400;', '1,400;'])
        weight.push(400)
      }
    }
    if (weight.length !== 0) {
      const str = param.sort().toString().replace(/;,/gi, ';')
      string = str.substring(0, str.length - 1)
      string = `wght@${string}`
    }
    return [weight, style, string]
  }

  const checkedExistingGoogleFontVariantNStyle = () => {
    const weightVariants = styles.font.fontWeightVariants
    const styleVariants = styles.font.fontStyle

    const [fontWeight, fontStyle] = findExistingFontStyleNWeight(styles, themeVars)

    const getNotExistVariant = fontWeight.filter(w => !weightVariants.includes(Number(w)))
    const getNotExistsStyle = fontStyle.filter(w => !styleVariants.includes(Number(w)))

    if (getNotExistVariant.length > 0) {
      toast.error(`Not available font weight ${getNotExistVariant.toString()}!`)
    }
    if (getNotExistsStyle.length > 0) {
      toast.error(`Not available font style ${getNotExistsStyle.toString()}!`)
    }
  }

  const setCheck = (fontFamily, variants) => {
    const [weight, style, string] = getGoogleFontWeightStyle(variants)
    const url = generateFontUrl(fontFamily, string)
    setStyles(prvStyles => create(prvStyles, draft => {
      draft.font.fontType = 'Google'
      draft.font.fontWeightVariants = weight
      draft.font.fontStyle = style
      draft.font.fontURL = url
      draft.font.fontFamily = fontFamily
      draft.form[`._frm-bg-b${formID}`]['font-family'] = fontFamily
    }))
    setThemeVars(prvState => create(prvState, draft => {
      draft['--g-font-family'] = fontFamily
    }))
    styles.font.fontType === 'Google' && checkedExistingGoogleFontVariantNStyle()
    addToBuilderHistory(generateHistoryData(element, fieldKey, 'Font', `${fontFamily} ${variants}`, { styles: getLatestState('styles'), themeVars: getLatestState('themeVars') }))
  }

  const sortFonts = (orderBy) => {
    if (orderBy === 'ASC') {
      const sortedFonts = sortByField(fonts, 'family', orderBy)
      setSorted(true)
      setFonts(sortedFonts)
    } else {
      const localFonts = JSON.parse(localStorage.getItem('bf-fonts'))
      setSorted(false)
      setFonts(localFonts)
    }
  }

  const setThemeFont = ({ target: { checked } }) => {
    const font = checked ? 'inherit' : ''
    setThemeVars(prvState => create(prvState, draft => {
      draft['--g-font-family'] = font
    }))
    setStyles(prvStyle => create(prvStyle, draft => {
      draft.font.fontType = font
      draft.font.fontURL = ''
      draft.font.fontStyle = []
      draft.font.fontWeightVariants = []
      draft.font.fontFamily = font
    }))
    addToBuilderHistory(generateHistoryData(element, fieldKey, 'Font', font, { styles: getLatestState('styles'), themeVars: getLatestState('themeVars') }))
  }

  const customFontHandler = ({ target: { name, value } }) => {
    if (name === 'fontURL') {
      if (!isValidURL(value)) return
      setStyles(prvStyle => create(prvStyle, draft => {
        draft.font.fontType = 'Custom'
        draft.font.fontURL = value
        draft.font.fontStyle = []
        draft.font.fontWeightVariants = []
      }))
      addToBuilderHistory(generateHistoryData(element, fieldKey, 'Font', `Custom ${value}`, { styles: getLatestState('styles') }))
    } else {
      setStyles(prvStyle => create(prvStyle, draft => {
        if (prvStyle.font.fontType === 'Google') {
          draft.font.fontURL = ''
        }
        draft.font.fontType = 'Custom'
        draft.font.fontStyle = []
        draft.font.fontWeightVariants = []
        draft.font.fontFamily = value
      }))
      setThemeVars(prvState => create(prvState, draft => {
        draft['--g-font-family'] = value
      }))
      addToBuilderHistory(generateHistoryData(element, fieldKey, 'Font', `Custom ${value}`, { styles: getLatestState('styles'), themeVars: getLatestState('themeVars') }))
    }
  }

  const urlValidationHandler = ({ target: { value } }) => {
    if (value !== '' && !isValidURL(value)) toast.error('Font url is invalid!')
  }
  return (
    <div className={css(fontStyle.container)}>
      <div className={css(ut.flxcb, ut.mb2)}>
        <span className={css(fontStyle.title)}>Inherit from theme</span>
        <SingleToggle
          name="themeInherit"
          isChecked={inheritFont}
          action={setThemeFont}
          id={id}
        />
      </div>
      <StyleSegmentControl
        options={[{ label: 'Custom' }, { label: 'Google' }]}
        onChange={lbl => onTabChangeHandler(lbl)}
        defaultActive={controller}
        wideTab
        className={css(inheritFont && fontStyle.disabled)}
      />
      {loading && (
        <div title="Loading...">
          <div className={css(ut.mt2)} />
          {Array(6).fill(1).map((itm, i) => (
            <div
              key={`loderfnt-${i * 2}`}
              title="Loading..."
              className={`${css({ w: '95%', h: 28, brs: 5, lh: 2, my: 3, mx: 5 })} loader`}
            />
          ))}
        </div>
      )}
      {!inheritFont && controller === 'Google' && (
        <>
          <div className={css(ut.flxc, fontStyle.searchBar, ut.mt2, ut.mb2)}>
            <div className={css(fontStyle.fields_search)} style={{ width: focusSearch ? '100%' : '90%' }}>
              <input
                title="Search fonts"
                aria-label="Search fonts"
                placeholder="Search fonts..."
                id="search-icon"
                type="search"
                name="searchIcn"
                onChange={searchHandler}
                onFocus={() => setfocusSearch(true)}
                onBlur={() => setfocusSearch(false)}
                className={css(fontStyle.search_field)}
                data-testid="search-font"
              />
              <span title="search" className={css(fontStyle.search_icn)}>
                <SearchIcon size="20" />
              </span>
            </div>
            {!focusSearch
              && (
                <button
                  title="Sort by ascending order"
                  className={`${css(fontStyle.sort_btn)} ${isSorted && 'active'}`}
                  type="button"
                  onClick={() => sortFonts(isSorted ? 'DESC' : 'ASC')}
                  aria-label="Sort Fonts Family"
                  data-testid="sort-font"
                >
                  <AtoZSortIcn size="20" />
                </button>
              )}
          </div>
          <VirtualList
            style={{ width: '100%', height: 200 }}
            itemCount={fonts.length || 1}
            itemSizes={fonts.length ? 30 : 0}
            scrollToIndex={fonts.length ? findSelectedFontIndx() : 0}
            scrollToAlignment="center"
            renderItem={(index) => (
              <button
                className={css(fontStyle.btn)}
                type="button"
                onClick={() => setCheck(fonts[index]?.family, fonts[index]?.variants)}
                data-testid={`set-font-${fonts[index]?.family}`}
              >
                <span className={css(fontStyle.title)}>{fonts[index]?.family}</span>
                {
                  ((fontSource && (themeVars['--g-font-family'] === fonts[index]?.family || savedThemeVars['--g-font-family'] === fonts[index]?.family)))
                  && <CheckMarkIcn className={css(fontStyle.btnColor)} size="19" />
                }
              </button>
            )}
          />
        </>
      )}

      {(controller === 'Custom' || controller === 'inherit') && (
        !inheritFont && (
          <>
            <div className={css(ut.flxClm, ut.mt2)}>
              <span className={css(fontStyle.title)}>Link</span>
              <input
                className={css(fontStyle.url)}
                onChange={customFontHandler}
                onBlur={urlValidationHandler}
                name="fontURL"
                aria-label="Custom font url"
                type="url"
                placeholder="e.g: http://fonts.gstatic.com/s/roboto/v29/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf"
                data-testid="custom-font-url"
              />
            </div>
            <div className={css(ut.flxClm, ut.mt2)}>
              <span className={css(fontStyle.title)}>Font Family</span>
              <input
                value={((styles.font.fontType !== 'Google') && themeVars['--g-font-family']) || ''}
                className={css(fontStyle.url)}
                onChange={customFontHandler}
                name="font-family"
                aria-label="Custom font family"
                type="text"
                placeholder="e.g: Lato"
                data-testid="custom-font-family"
              />
            </div>
          </>
        )
      )}
    </div>
  )
}

const fontStyle = {
  container: {
    scrollBehavior: 'auto !important',
    mb: 5,
    '& *': { scrollBehavior: 'auto !important' },
  },
  url: {
    w: '100%',
    brs: '8px !important',
    b: '1px solid var(--white-0-75)  !important',
    oe: 0,
    p: 5,
    ':focus': {
      // bs: '0px 0px 3px 0px var(--b-50) !important',
      focusShadow: 1,
      bcr: 'var(--b-92-62) !important',
      pr: '0px !important',
      '& ~ .shortcut': { dy: 'none' },
      '& ~ span svg': { cr: 'var(--b-50)' },
    },
  },
  btn: {
    b: 0,
    p: 5,
    h: 30,
    // pr: 36,
    w: '100%',
    brs: 8,
    fw: 500,
    // flx: 'align-center',
    flx: 'center-between',
    pn: 'relative',
    bc: 'var(--white-100)',
    curp: 1,
    '&:hover': {
      bc: 'var(--white-0-93)',
      '& svg': { fr: 'drop-shadow(1px 1px 0.5px #b3b3b3)' },
    },
    '&:focus-visible': {
      oe: 'none',
      bs: '0 0 0 2px var(--b-50) inset',
    },
    '& svg': {
      'flex-shrink': 0,
      w: 20,
      h: 20,
      // mr: 10,
      stroke: 'var(--black-0)',
      '&:nth-of-type(2)': {
        mr: 0,
        pn: 'absolute',
        rt: 8,
      },
    },
  },
  title: { fs: 12, mb: 2 },
  search_field: {
    w: '100%',
    oe: 'none',
    b: '1px solid var(--white-0-75) !important',
    brs: '9px !important',
    pl: '27px !important',
    pr: '5px !important',
    ':focus': {
      // bs: '0px 0px 3px 0px var(--b-50) !important',
      focusShadow: '',
      bcr: 'var(--b-92-62) !important',
      pr: '0px !important',
      '& ~ .shortcut': { dy: 'none' },
      '& ~ span svg': { cr: 'var(--b-50)' },
    },
    '::placeholder': { fs: 12 },
    '::-webkit-search-cancel-button': {
      appearance: 'none',
      w: 14,
      h: 14,
      mr: 10,
      bd: 'var(--white-0-83)',
      curp: 1,
      backgroundPosition: '54% 50% !important',
      // eslint-disable-next-line quotes
      bi: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='Black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E")`,
      brs: 20,
    },

  },
  search_icn: {
    pn: 'absolute',
    tp: '50%',
    mx: 6,
    lt: 0,
    tm: 'translateY(-50%)',
    cr: 'var(--white-0-75)',
    curp: 1,
    '& svg': { dy: 'block' },
  },
  searchBar: {
    pn: 'relative',
    zx: 99,
  },
  fields_search: {
    pn: 'relative',
    mr: 5,
    tn: 'width .2s',
  },
  btnColor: { cr: 'var(--b-50)' },
  sort_btn: {
    w: 25,
    h: 30,
    cr: 'var(--white-0-50)',
    p: 0,
    b: 'none',
    bd: 'transparent',
    brs: 8,
    flxc: 1,
    curp: 1,
    flx: 'center',
    ':hover:not(.active)': { bd: 'var(--white-0-81-32)', cr: 'var(--b-53-8)' },
    '&.active': {
      bd: 'var(--b-79-96)',
      cr: 'var(--b-50)',
    },
  },
  disabled: {
    oy: '0.5',
    cur: 'not-allowed',
    pe: 'none',
  },

}

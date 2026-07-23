/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { Link, useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import CheckMarkIcn from '../../Icons/CheckMarkIcn'
import EditIcn from '../../Icons/EditIcn'
import EyeIcon from '../../Icons/EyeIcon'
import { addToBuilderHistory, generateHistoryData, reCalculateFldHeights } from '../../Utils/FormBuilderHelper'
import Tip from '../Utilities/Tip'
import themes from './themes/themeList'
import { getSingleFieldStyle } from './themes/themeProvider'

export default function CustomThemeGallary({ fldKey }) {
  const { css } = useFela()
  const [styles, setStyles] = useAtom($styles)
  const selectedFieldId = useAtomValue($selectedFieldId)
  const fields = useAtomValue($fields)
  const fieldType = fields[fldKey].typ
  const customThemes = [
    { name: 'Checkbox Theme', slug: 'individual', img: '', allowedFlds: ['check', 'radio'] },
  ]

  const themesForFld = [...themes, ...customThemes.filter(theme => theme.allowedFlds.includes(fieldType))]

  const getStyle = (slug, fk, type) =>
    // Use getSingleFieldStyle helper to get field style for any theme (base or derived)
    getSingleFieldStyle(slug, fk, type, {
      breakpoint: 'lg',
      colorScheme: 'light',
      direction: 'ltr',
    })

  const handleThemeApply = (themeSlug) => {
    const fk = fldKey || selectedFieldId
    const newStyles = create(styles, drftStyle => {
      const type = drftStyle.fields[fk].fieldType
      drftStyle.fields[fk] = getStyle(themeSlug, fk, type)
    })
    setStyles(newStyles)
    reCalculateFldHeights(fldKey)
    addToBuilderHistory(generateHistoryData('', fk, 'theme', themeSlug, { styles: newStyles }))
  }

  const checkActiveTheme = (themeSlug) => {
    const fk = fldKey || selectedFieldId
    return styles.fields[fk]?.theme === themeSlug
  }

  return (
    <div className={css(themeGalStyle.thm_container)}>
      {themesForFld.map(theme => (
        <CustomThemeGallary.Card
          key={theme.name}
          name={theme.name}
          applyThemeAction={() => handleThemeApply(theme?.slug)}
          img={theme.img}
          isActive={checkActiveTheme(theme?.slug)}
        />
      ))}
    </div>
  )
}

const Card = ({ name, img, isActive, applyThemeAction }) => {
  const { formType, formID } = useParams()
  const { css } = useFela()

  return (
    <div className={css(themeGalStyle.thm_wrp)}>
      <div className={css(themeGalStyle.thm_btn, isActive && themeGalStyle.activeStyle)}>
        <div data-thm-ctrl-wrp className={css(themeGalStyle.thm_control_wrp)}>
          <Tip msg="Preview">
            <button type="button" className={css(themeGalStyle.thm_ctrl_btn)} aria-label="Theme Preview">
              <EyeIcon size="20" />
            </button>
          </Tip>
          {isActive ? (
            <Tip msg="Customize theme">
              <Link to={`/form/builder/${formType}/${formID}/theme-customize`} type="button" className={css(themeGalStyle.thm_ctrl_btn)} aria-label="Theme Customize">
                <EditIcn size="20" stroke="2.2" />
              </Link>
            </Tip>
          ) : (
            <Tip msg="Apply Theme">
              <button
                type="button"
                onClick={applyThemeAction}
                className={css(themeGalStyle.thm_ctrl_btn)}
                aria-label="Theme Preview"
              >
                <CheckMarkIcn size="20px" />
              </button>
            </Tip>
          )}

        </div>
        <img
          className={css(themeGalStyle.thmImg)}
          width="120"
          height="147.64"
          alt="Theme thumbnail"
          src={img || `https://raw.githubusercontent.com/Bit-Apps-Pro/bitform-resourses/main/theme-thumbnails/${img}`}
        />
      </div>
      <span className={css(themeGalStyle.thm_name)}>{name}</span>
    </div>
  )
}

CustomThemeGallary.Card = Card

const themeGalStyle = {
  thm_container: {
    flx: 1,
    flxp: 'jc',
  },

  thmImg: { dy: 'block' },
  thm_wrp: {
    w: 124,
    h: 170,
    flxi: 1,
    fd: 'column',
    mx: 5,
    mt: 10,
  },
  thm_btn: {
    pn: 'relative',
    curp: 1,
    b: '2px solid var(--white-0-83)',
    brs: 8,
    p: 0,
    bd: 'var(--white-100)',
    ow: 'hidden',
    ':hover': {
      bcr: 'var(--white-0-50)',
      '& div[data-thm-ctrl-wrp]': { oy: '1 !important', visibility: 'visible' },
    },
  },
  thm_name: {
    fs: 13,
    mt: 4,
  },
  thm_control_wrp: {
    pn: 'absolute',
    w: '100%',
    h: '100%',
    bd: '#1a1b318c',
    backdropFilter: 'blur(2px)',
    flx: 'center',
    oy: 0,
    visibility: 'hidden',
    tn: 'opacity .3s',
  },
  thm_ctrl_btn: {
    p: 0,
    brs: '50%',
    w: 30,
    h: 30,
    b: '1px solid gray',
    flx: 'center',
    mx: 2,
    curp: 1,
    cr: 'var(--b-54-12)',
    bd: 'var(--white-0-95)',
    ':hover': {
      cr: 'var(--b-50)',
      bd: 'var(--white-100)',
    },
  },
  activeStyle: {
    bcr: 'var(--b-50)',
    bs: '0 0 0 2px var(--b-50)',
  },
}

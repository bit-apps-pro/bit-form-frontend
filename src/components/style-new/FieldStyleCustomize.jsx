import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { memo, useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { Navigate, useParams } from 'react-router-dom'
import { $builderRightPanelScroll, $fields, $flags } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import CloseIcn from '../../Icons/CloseIcn'
import TrashIcn from '../../Icons/TrashIcn'
import { addToBuilderHistory, deleteNestedObj, generateHistoryData, getLatestState } from '../../Utils/FormBuilderHelper'
import { IS_PRO } from '../../Utils/Helpers'
import { getElementTitle } from '../../Utils/StaticData/IndividualElementTitle'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import AutoResizeInput from '../CompSettings/CompSettingsUtils/AutoResizeInput'
import PremiumSettingsOverlay from '../CompSettings/StyleCustomize/ChildComp/PremiumSettingsOverlay'
import RightPanelTopBar from '../UIv3/CompSettings/RightPanelTopBar'
import StyleSectionHeader from '../UIv3/CompSettings/StyleCustomize/StyleSectionHeader'
import TabsView from '../UIv3/Utilities/TabsView'
import IndividualCustomStyle from '../UIv3/style-new/IndividualCustomStyle'
import themeCustomizeStyles from '../UIv3/style-new/themeCustomize.styles'
import SingleToggle from '../Utilities/SingleToggle'
import FieldQuickTweaks from './FieldQuickTweaks'
import elementCssPropertiesConfig from './NewStyleEditorConfig'
import { assignNestedObj, getActualElementKey } from './styleHelpers'
import { getSingleFieldStyle } from './themes/themeProvider'

export default function FieldStyleCustomizeHOC() {
  const { formType, formID, '*': rightParams } = useParams()
  const [, element, fieldKey] = rightParams.split('/')
  const styles = useAtomValue($styles)

  if (!styles?.fields?.[fieldKey]) {
    return <Navigate to={`/form/builder/${formType}/${formID}/theme-customize/quick-tweaks`} />
  }
  return <FieldStyleCustomize {...{ formType, formID, fieldKey, element }} />
}
const FieldStyleCustomize = memo(({ formType, formID, fieldKey, element }) => {
  const { css } = useFela()
  const [styles, setStyles] = useAtom($styles)
  const [controller, setController] = useState('style')
  const setFlags = useSetAtom($flags)
  const [fields, setFields] = useAtom($fields)
  const fldStyleObj = styles?.fields?.[fieldKey]
  const { fieldType, theme } = fldStyleObj
  const options = [
    { label: 'style', icn: 'Custom Style', show: ['icn'], tip: 'Custom style' },
    { label: 'classes', icn: 'Custom Classes', show: ['icn'], tip: 'Custom Classes' },
  ]
  const customClsName = fields[fieldKey]?.customClasses

  // const isFieldElemetOverrided = fldStyleObj?.overrideGlobalTheme?.includes(element)
  const list = Array.isArray(fldStyleObj?.overrideGlobalTheme)
    ? fldStyleObj.overrideGlobalTheme
    : []

  const isFieldElemetOverrided = list.includes(element)

  const getPath = (elementKey, state = '') => `fields->${fieldKey}->classes->.${fieldKey}-${elementKey}${state}`

  useEffect(() => {
    setFlags(oldFlgs => ({ ...oldFlgs, styleMode: true }))
  }, [])

  const deleteStyle = (drft, elemnt, state = '') => {
    const hoverStyle = drft.fields[fieldKey].classes[`.${fieldKey}-${elemnt}${state}`]
    if (hoverStyle) deleteNestedObj(drft, getPath(elemnt, state))
  }

  const title = getElementTitle(element)

  const overrideGlobalThemeHandler = ({ target: { checked } }, elmnt) => {
    // if (theme === 'material') return
    if (checked) {
      setStyles(prvStyle => create(prvStyle, drft => {
        drft.fields[fieldKey].overrideGlobalTheme = [...prvStyle.fields[fieldKey].overrideGlobalTheme, elmnt]
      }))
    } else {
      setStyles(prvStyle => create(prvStyle, drft => {
        const prvElmnt = [...prvStyle.fields[fieldKey].overrideGlobalTheme]
        prvElmnt.splice(prvElmnt.findIndex(el => el === elmnt), 1)
        drft.fields[fieldKey].overrideGlobalTheme = prvElmnt

        if (theme === 'bitformDefault' || theme) {
          // const { classes: getElementStyleClasses } = theme === 'bitformDefault' ? bitformDefaultTheme({ fieldKey, type: fieldType }) : atlassianTheme({ fk: fieldKey, type: fieldType })
          const { classes: getElementStyleClasses } = getSingleFieldStyle(theme, fieldKey, fieldType, { breakpoint: 'lg', colorScheme: 'light', direction: 'ltr' })

          switch (elmnt) {
            case 'currency-fld-wrp':
            case 'phone-fld-wrp':
              const curcyFldWrp = getElementStyleClasses[`.${fieldKey}-${elmnt}`]
              const curcyFldWrpHover = getElementStyleClasses[`.${fieldKey}-${elmnt}:hover:not(.${fieldKey}-menu-open, .${fieldKey}-disabled)`]
              const curcyFldWrpFocus = getElementStyleClasses[`.${fieldKey}-${elmnt}:focus-within:not(.${fieldKey}-menu-open, .${fieldKey}-disabled)`]
              assignNestedObj(drft, getPath(`${elmnt}`), curcyFldWrp)
              assignNestedObj(drft, getPath(`${elmnt}:hover:not(.${fieldKey}-menu-open, .${fieldKey}-disabled)`), curcyFldWrpHover)
              assignNestedObj(drft, getPath(`${elmnt}:focus-within:not(.${fieldKey}-menu-open, .${fieldKey}-disabled)`), curcyFldWrpFocus)
              break

            case 'selected-currency-img':
            case 'selected-country-img':
              const selectedCurncyImg = getElementStyleClasses[`.${fieldKey}-${elmnt}`]
              assignNestedObj(drft, getPath(elmnt), selectedCurncyImg)
              break

            case 'input-clear-btn':
              const inputClrBtn = getElementStyleClasses[`.${fieldKey}-input-clear-btn`]
              const inputClrBtnHvr = getElementStyleClasses[`.${fieldKey}-input-clear-btn:hover`]
              const inputCltBtnFocus = getElementStyleClasses[`.${fieldKey}-input-clear-btn:focus-visible`]
              assignNestedObj(drft, getPath('input-clear-btn'), inputClrBtn)
              assignNestedObj(drft, getPath('input-clear-btn:hover'), inputClrBtnHvr)
              assignNestedObj(drft, getPath('input-clear-btn:focus-visible'), inputCltBtnFocus)
              break

            case 'opt-search-input':
              const optSearchInput = getElementStyleClasses[`.${fieldKey}-opt-search-input`]
              assignNestedObj(drft, getPath('opt-search-input'), optSearchInput)
              deleteStyle(drft, 'opt-search-input', ':hover')
              deleteStyle(drft, 'opt-search-input', ':focus')
              break

            case 'opt-search-icn':
              const optSearchIcn = getElementStyleClasses[`.${fieldKey}-opt-search-icn`]
              assignNestedObj(drft, getPath('opt-search-icn'), optSearchIcn)
              deleteStyle(drft, 'opt-search-icn', ':hover')
              break

            case 'search-clear-btn':
              const seatchClrBtn = getElementStyleClasses[`.${fieldKey}-search-clear-btn`]
              const searchClrBtnHrv = getElementStyleClasses[`.${fieldKey}-search-clear-btn:hover`]
              const searchClrBtnFocus = getElementStyleClasses[`.${fieldKey}-search-clear-btn:focus-visible`]
              assignNestedObj(drft, getPath('search-clear-btn'), seatchClrBtn)
              assignNestedObj(drft, getPath('search-clear-btn:hover'), searchClrBtnHrv)
              assignNestedObj(drft, getPath('search-clear-btn:focus-visible'), searchClrBtnFocus)
              break

            case 'option':
              const opt = getElementStyleClasses[`.${fieldKey}-option`]
              const optHovr = getElementStyleClasses[`.${fieldKey}-option:hover:not(.selected-opt)`]
              const optFocus = getElementStyleClasses[`.${fieldKey}-option:focus-visible`]
              assignNestedObj(drft, getPath('option'), opt)
              assignNestedObj(drft, getPath('option:hover:not(.selected-opt)'), optHovr)
              assignNestedObj(drft, getPath('option:focus-visible'), optFocus)
              break

            case 'opt-icn':
              const optIcn = getElementStyleClasses[`.${fieldKey}-opt-icn`]
              assignNestedObj(drft, getPath('opt-icn'), optIcn)
              break

            case 'opt-lbl':
              const optLbl = getElementStyleClasses[`.${fieldKey}-opt-lbl`]
              assignNestedObj(drft, getPath('opt-lbl'), optLbl)
              break

            case 'opt-suffix':
              const optSuf = getElementStyleClasses[`.${fieldKey}-opt-suffix`]
              assignNestedObj(drft, getPath('opt-suffix'), optSuf)
              break

            case 'opt-prefix':
              const optPrefix = getElementStyleClasses[`.${fieldKey}-opt-prefix`]
              assignNestedObj(drft, getPath('opt-prefix'), optPrefix)
              break

            case 'cc':
              const cc = getElementStyleClasses[`.${fieldKey}-cc`]
              assignNestedObj(drft, getPath('cc'), cc)
              deleteStyle(drft, 'cc', ':hover')
              break

            case 'ct':
              const ct = getElementStyleClasses[`.${fieldKey}-ct`]
              assignNestedObj(drft, getPath('ct'), ct)
              deleteStyle(drft, 'ct', ':hover')
              deleteStyle(drft, 'ct', ':focus')
              break

            case 'ck':
            case 'rdo':
              const optBox = elmnt === 'ck' ? 'ck' : 'rdo'
              const ck = getElementStyleClasses[`.${fieldKey}-${optBox}`]
              assignNestedObj(drft, getPath(optBox), ck)
              deleteStyle(drft, optBox, ':hover')
              deleteStyle(drft, optBox, ':focus')
              deleteStyle(drft, optBox, ':checked')
              break

            case 'cw':
              const cw = getElementStyleClasses[`.${fieldKey}-cw`]
              assignNestedObj(drft, getPath('cw'), cw)
              deleteStyle(drft, 'cw', ':hover')
              break

            case 'cl':
              const cl = getElementStyleClasses[`.${fieldKey}-cl`]
              assignNestedObj(drft, getPath('cl'), cl)
              deleteStyle(drft, 'cl', ':hover')
              break

            default:
              const actualElmnt = getActualElementKey(elmnt)
              const allDefaltStyle = getElementStyleClasses[`.${fieldKey}-${actualElmnt}`] || {}
              assignNestedObj(drft, getPath(actualElmnt), allDefaltStyle)
              const states = [...elementCssPropertiesConfig[fieldType][actualElmnt].states]
              states?.map(state => {
                const tempDefault = getElementStyleClasses[`.${fieldKey}-${actualElmnt}:${state}`]
                if (tempDefault) {
                  assignNestedObj(drft, getPath(`${actualElmnt}:${state}`), tempDefault)
                } else {
                  deleteStyle(drft, actualElmnt, `:${state}`)
                }
              })
              break
          }
        }
        // if (theme === 'material') {
        //   drft.fields[fieldKey] = materialTheme(fieldKey, fieldType)
        // }
      }))
    }
  }

  const checkExistElement = () => fldStyleObj?.overrideGlobalTheme?.find(el => el === element)

  const customClsNamHandler = (e) => {
    const { value } = e.target
    const allFields = create(fields, drftFld => {
      drftFld[fieldKey].customClasses[element] = value
    })
    setFields(allFields)
    addToBuilderHistory(generateHistoryData(element, fieldKey, 'Custom Class Modify', '', { fields: getLatestState('fields') }))
  }

  const addCustomAttribute = () => {
    const allFields = create(fields, drftFld => {
      const preAttr = fields[fieldKey].customAttributes[element]
      if (preAttr) {
        drftFld[fieldKey].customAttributes[element] = [...preAttr, { key: '', value: '' }]
      } else {
        drftFld[fieldKey].customAttributes[element] = [{ key: '', value: '' }]
      }
    })
    setFields(allFields)
    addToBuilderHistory(generateHistoryData(element, fieldKey, 'Add Attribute to', '', { fields: getLatestState('fields') }))
  }

  const attributeHandler = (e, index) => {
    const { name, value } = e.target
    const allFields = create(fields, drftFld => {
      drftFld[fieldKey].customAttributes[element][index][name] = value
    })
    setFields(allFields)
    addToBuilderHistory(generateHistoryData(element, fieldKey, 'Modify Attribute', '', { fields: getLatestState('fields') }))
  }

  const deleteCustomAttribute = (index) => {
    const allFields = create(fields, drftFld => {
      const prvAttbut = fields[fieldKey].customAttributes[element]
      const newAttbut = [...prvAttbut]
      newAttbut.splice(index, 1)
      drftFld[fieldKey].customAttributes[element] = newAttbut
    })
    setFields(allFields)
    addToBuilderHistory(generateHistoryData(element, fieldKey, 'Delete Attribute', '', { fields: getLatestState('fields') }))
  }

  const renderIndividualCustomStyleComp = () => {
    const elementKey = element
    const classKey = element
    return (
      <div className={css(!checkExistElement(classKey) && cls.blur)}>
        <IndividualCustomStyle elementKey={elementKey || classKey} fldKey={fieldKey} />
      </div>
    )
  }
  const scrollTo = useAtomValue($builderRightPanelScroll)

  const styleContentRender = () => (
    <>
      <SingleToggle
        id="overrideGlobalTheme-style"
        title={__('Override theme and common styles')}
        {...IS_PRO && { action: (e) => overrideGlobalThemeHandler(e, element) }}
        isChecked={isFieldElemetOverrided}
        className={css(ut.m10)}
        isPro
        proProperty="individualStyle"
      />
      <div className={css(cls.container)}>
        {renderIndividualCustomStyleComp()}
      </div>
    </>
  )
  const classesContentRender = () => (
    <div className="pos-rel">
      {!IS_PRO && (<PremiumSettingsOverlay hideText proProperty="customClassAttr" />)}

      <div className={css(ut.m10)}>
        <label className={css({ fs: 14, fw: 500 })}>Custom Class Names</label>
        <AutoResizeInput
          ariaLabel="Custom Class Names"
          placeholder="e.g. class1 class2 class3"
          value={customClsName?.[element] || ''}
          changeAction={customClsNamHandler}
          rows="3"
          id={`${fieldKey}-${element}`}
        />
      </div>

      <div className={css(cls.divider)} />
      <div className={css(ut.m10)}>
        <span className={css({ fs: 14, fw: 500 })}>Custom Attributes</span>
        <div className={css({ w: '80%', ml: 18 })}>
          <div className={css(cls.customAttrContainer)}>
            <div className={css({ w: '50%' })}>
              <span className={css({ fs: 13, fw: 500 })}>Key</span>
            </div>
            <div className={css({ w: '50%' })}>
              <span className={css({ fs: 13, fw: 500 })}>Value</span>
            </div>
          </div>
        </div>
        {fields[fieldKey]?.customAttributes?.[element] && fields[fieldKey]?.customAttributes[element].map((attr, indx) => (
          <div
            key={`custon-attribute-${indx + 1}`}
            className={css(cls.customAttrItem, ut.mx10)}
          >
            <div className={css({ w: '40%' })}>
              <input
                placeholder="Key"
                aria-label="custom attribute key"
                name="key"
                onChange={e => attributeHandler(e, indx)}
                value={attr.key}
                className={css(FieldStyle.input)}
                type="text"
                data-testid={`${fieldKey}-${element}-atrbut-key`}
              />
            </div>
            <span className={css(cls.pair)}>=</span>
            <div className={css({ w: '40%' })}>
              <input
                aria-label="custom attribute value"
                placeholder="Value"
                name="value"
                onChange={e => attributeHandler(e, indx)}
                value={attr.value}
                className={css(FieldStyle.input)}
                type="text"
                data-testid={`${fieldKey}-${element}-atrbut-value`}
              />
            </div>
            <button
              className={css(cls.addBtn, cls.delBtnHover, ut.ml1, ut.mt1)}
              type="button"
              aria-label="Delete Custom Attribute"
              onClick={() => deleteCustomAttribute(indx)}
              data-testid={`${fieldKey}-${element}-attbut-delete`}
            >
              <TrashIcn size="12" />
            </button>
          </div>
        ))}
        <div className={css(cls.addContainer)}>
          <button
            className={css(themeCustomizeStyles.addItemBtn)}
            type="button"
            aria-label="Add Custom Attribute"
            onClick={addCustomAttribute}
            data-testid={`${fieldKey}-${element}-attbut-add`}
          >
            <CloseIcn size="12" className={css({ tm: 'rotate(45deg)' })} />
            <span className={css(ut.ml1)}>Add Attribute</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={css(cls.mainWrapper)}>
      <RightPanelTopBar />
      <div className={css(cls.contentWrapper)}>

        <StyleSectionHeader
          title={fields[fieldKey]?.adminLbl || fields[fieldKey]?.lbl || fields[fieldKey]?.typ}
          subtitle={title}
          highlightSelector={`[data-dev-${element?.replace('quick-tweaks', 'fld-wrp')}=${fieldKey}]`}
          fieldKey={fieldKey}
          onCopy={() => console.log('hello')}
          scrollTo={scrollTo}
          showProBadge
        />

        <div className={css(cls.wrp)}>
          {element === 'quick-tweaks' && <FieldQuickTweaks fieldKey={fieldKey} />}
          {element !== 'quick-tweaks' && (
            <TabsView
              tabs={[
                { id: 'style', label: 'Custom Style', content: styleContentRender() },
                { id: 'classes', label: 'Custom Classes', content: classesContentRender() },
              ]}
              defaultTab="style"
              onChange={lbl => setController(lbl)}
              // variant="primary-clean-fullwidth"
              variant="tertiary-clean-fullwidth"
              className={css({ '& .tab-content': { owx: 'clip', owy: 'visible' } })}
            />
          )}
        </div>
      </div>
    </div>
  )
})

const cls = {
  title: { mt: 5, mb: 2 },
  breadcumbLink: { fs: 11, flxi: 'center', mr: 3, ':focus': { bs: 'none' } },
  l1: { cr: 'var(--white-0-61)', ':hover': { textDecoration: 'underline !important' } },
  l2: { cr: 'var(--white-0-21)' },
  wrp: {
    p: '5px 15px 20px',
    fs: 12,
  },
  mainWrapper: {
    bd: 'var(--white-100)',
  },
  subTitle: { mt: 5, mb: 5, mr: 5, fs: 15, cr: 'var(--white-0-31)' },
  subTitle2: { fs: 14, fw: 500, mt: 10 },
  divider: { bb: '1px solid var(--white-0-83)', mx: 3, my: 10 },
  container: { mx: 10, pn: 'relative' },
  btn: {
    b: 'none',
    oe: 'none',
    brs: 8,
    bc: 'var(--white-0-95)',
    cur: 'pointer',
  },
  pnt: { cur: 'not-allowed' },
  menuItem: {
    ws: 'nowrap',
    fs: 14,
    fw: 500,
    b: 'none',
    bd: 'transparent',
    curp: 1,
    py: 8,
    px: 15,
    brs: 20,
    pn: 'relative',
    ':hover:not([data-active="true"])': { bd: 'var(--b-79-96)' },
  },
  clrActive: {
    bd: 'var(--b-50)',
    cr: 'var(--white-100)',
  },
  con: { py: 10, bb: '0.5px solid var(--white-0-83)' },
  blur: {
    oy: '0.5',
    cur: 'not-allowed',
    bd: 'white',
    zx: 9,
    pe: 'none',
  },
  pill: {
    brs: 8,
    b: '1px solid var(--b-31-44-27)',
    px: 5,
    py: 2,
    bd: 'var(--b-23-95)',
    fw: 500,
  },
  customAttrContainer: { flx: 'center-between', mt: 5, ta: 'center' },
  customAttrItem: { flx: 'center' },
  pair: { fs: 20, mt: 5, mx: 5 },
  addBtn: {
    se: 25,
    b: 'none',
    brs: '50%',
    p: 0,
    flxi: 'center',
    bd: 'var(--white-0-95)',
    curp: 1,
    tn: 'transform 0.2s',
    ':active': { tm: 'scale(0.95)' },
  },
  addBtnHover: { ':hover': { tm: 'scale(1.1)', cr: 'var(--b-50)' } },
  delBtnHover: { ':hover': { tm: 'scale(1.1)', cr: 'red' } },
  addContainer: {
    flx: 'center',
    width: 'calc(100% - 30px)',
  },
}

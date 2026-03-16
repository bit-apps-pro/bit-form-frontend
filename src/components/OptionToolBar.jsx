import loadable from '@loadable/component'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { $isDraggable } from '../GlobalStates/FormBuilderStates'
import { $breakpoint, $builderHelperStates, $builderSettings, $colorScheme, $flags, $selectedFieldId } from '../GlobalStates/GlobalStates'
import AddIcon from '../Icons/AddIcon'
import BrushIcn from '../Icons/BrushIcn'
import DarkIcn from '../Icons/DarkIcn'
import EditIcn from '../Icons/EditIcn'
import EllipsisIcon from '../Icons/EllipsisIcon'
import InspectIcn from '../Icons/InspectIcn'
import LaptopIcn from '../Icons/LaptopIcn'
import LayerIcon from '../Icons/LayerIcon'
import LightIcn from '../Icons/LightIcn'
import MobileIcon from '../Icons/MobileIcon'
import SettingsIcn from '../Icons/SettingsIcn'
import TabletIcon from '../Icons/TabletIcon'
import { addToBuilderHistory, generateHistoryData, reCalculateFldHeights } from '../Utils/FormBuilderHelper'
import ut from '../styles/2.utilities'
import OptionToolBarStyle from '../styles/OptionToolbar.style'
import BreakpointSizeControl from './BreakpointSizeControl'
import Grow from './CompSettings/StyleCustomize/ChildComp/Grow'
import FormBuilderHistory from './FormBuilderHistory'
import CustomCodeEditorLoader from './Loaders/CustomCodeEditorLoader'
import TableBuilderSettings from './TableBuilderSettings'
import Downmenu from './Utilities/Downmenu'
import Modal from './Utilities/Modal'
import StyleSegmentControl from './Utilities/StyleSegmentControl'
import Tip from './Utilities/Tip'
import TipGroup from './Utilities/Tip/TipGroup'
import { removeUnuseStylesAndUpdateState } from './style-new/styleHelpers'

const CustomCodeEditor = loadable(() => import('./CompSettings/CustomCodeEditor'), { fallback: <CustomCodeEditorLoader /> })

export default function OptionToolBar({ showToolBar, setShowToolbar, isV2Form }) {
  const { css } = useFela()
  const { formType, formID, '*': rightBarUrl } = useParams()
  const rightBar = rightBarUrl.split('/')?.[0]
  const { darkModeConfig } = useAtomValue($builderSettings)
  const [flags, setFlags] = useAtom($flags)
  const breakpoint = useAtomValue($breakpoint)
  const colorScheme = useAtomValue($colorScheme)
  const setColorScheme = useSetAtom($colorScheme)
  const [responsiveMenu, setResponsiveMenu] = useState(false)
  const [modal, setModal] = useState(false)
  const selectedFldId = useAtomValue($selectedFieldId)
  const [settingsModalTab, setSettingsModalTab] = useState('Builder Settings')
  const navigate = useNavigate()
  const [defaultRightPanel, setDefaultRightPanel] = useState('fld-settings')
  const [defaultLeftPanel, setDefaultLeftPanel] = useState('Fields')
  const path = `/form/builder/${formType}/${formID}`
  const setBreakpoint = useSetAtom($breakpoint)
  const builderHelperStates = useAtomValue($builderHelperStates)
  const setIsDraggable = useSetAtom($isDraggable)

  useEffect(() => {
    if (rightBar.match(/fields-list|field-settings/)) {
      if (flags.styleMode || flags.inspectMode) {
        setFlags(prvFlags => ({ ...prvFlags, styleMode: false, inspectMode: false }))
      }
      setDefaultRightPanel('fld-settings')
      setDefaultLeftPanel('Fields')
    }
    if (rightBar.match(/themes|style|field-theme-customize|theme-customize/)) {
      if (!flags.styleMode) {
        setFlags(prvFlags => ({ ...prvFlags, styleMode: true }))
      }
      setDefaultRightPanel('theme-customize')
      setDefaultLeftPanel('Style')
    }
  }, [rightBar])

  const styleModeButtonHandler = () => {
    setFlags(prvFlags => {
      if (!prvFlags.styleMode) setShowToolbar(true)
      if (prvFlags.styleMode && showToolBar) setShowToolbar(false)
      if (prvFlags.styleMode && !showToolBar) setShowToolbar(true)
      return { ...prvFlags, styleMode: true, inspectMode: false }
    })
    if (selectedFldId) {
      navigate(`${path}/field-theme-customize/quick-tweaks/${selectedFldId}`, { replace: true })
    } else {
      navigate(`${path}/theme-customize/quick-tweaks`, { replace: true })
    }
    removeUnuseStylesAndUpdateState()
    reCalculateFldHeights()
  }

  const formFieldButtonHandler = () => {
    setFlags(prvFlags => {
      if (!prvFlags.styleMode) setShowToolbar(true)
      if (!prvFlags.styleMode && showToolBar) setShowToolbar(false)
      if (!prvFlags.styleMode && !showToolBar) setShowToolbar(true)
      return { ...prvFlags, styleMode: false, inspectMode: false }
    })
    if (selectedFldId) {
      navigate(`${path}/field-settings/${selectedFldId}`, { replace: true })
    } else {
      navigate(`${path}/fields-list`, { replace: true })
    }
    removeUnuseStylesAndUpdateState()
    reCalculateFldHeights()
  }

  const handleLeftPanel = (currentActive) => {
    if (currentActive === 'Fields') {
      formFieldButtonHandler()
    } else if (currentActive === 'Style') {
      styleModeButtonHandler()
    }
    setDefaultLeftPanel(currentActive)
  }

  const handleRightPanel = (currentActive) => {
    if (currentActive === 'fld-settings') {
      navigate(`${path}/fields-list`)
    } else if (currentActive === 'theme-customize') {
      navigate(`${path}/themes`)
    }
    removeUnuseStylesAndUpdateState()
    reCalculateFldHeights()
  }

  const inspectModeButtonHandler = () => {
    setFlags(prvFlags => ({ ...prvFlags, inspectMode: !prvFlags.inspectMode }))
  }

  const handleColorSchemeSwitch = () => {
    setColorScheme(prv => (prv === 'light' ? 'dark' : 'light'))
  }

  const handleBreakpointChange = brkPoint => {
    setBreakpoint(brkPoint)
    // startTransition(() => {
    //   if (builderHelperStates.respectLGLayoutOrder && brkPoint !== 'lg') setIsDraggable(false)
    //   else setIsDraggable(true)
    // })
    addToBuilderHistory(generateHistoryData('', '', 'Breakpoint', brkPoint, { breakpoint: brkPoint }))
  }

  return (
    <div className={css(OptionToolBarStyle.optionToolBar)}>
      <div className={css(OptionToolBarStyle.form_section)}>
        <div className={css(ut.flxc)}>
          <TipGroup>
            <StyleSegmentControl
              borderRadius={10}
              width={180}
              show={['icn', 'label']}
              tipPlace="bottom"
              defaultActive={defaultLeftPanel}
              options={[
                { icn: <AddIcon size="22" />, label: 'Fields', tip: 'Form Fields and Settings' },
                { icn: <LayerIcon size="22" />, label: 'Style', tip: 'Theme Customization' },
              ]}
              onChange={handleLeftPanel}
              wideTab
            />
            {/* *<TipGroup>
            <Tip msg="Form Fields">
              <button
                data-testid="field-mode"
                onClick={formFieldButtonHandler}
                type="button"
                className={`${css([OptionToolBarStyle.icn_btn, ut.icn_hover, ut.ml2])} ${(!flags.styleMode && showToolBar) && 'active'}`}
              >
                <AddIcon size="22" />
              </button>
            </Tip>
            <Tip msg="Styling">
              <button
                data-testid="style-mode"
                onClick={styleModeButtonHandler}
                type="button"
                className={`${css([OptionToolBarStyle.icn_btn, ut.icn_hover])} ${(flags.styleMode && showToolBar) && 'active'}`}
              >
                <LayerIcon size="22" />
              </button>
            </Tip>
          </TipGroup> */}
            {flags.styleMode && (
              <Tip msg="Inspect Element">
                <button
                  data-testid="inspect-element"
                  onClick={inspectModeButtonHandler}
                  type="button"
                  className={`${css([OptionToolBarStyle.icn_btn, ut.icn_hover])} ${flags.inspectMode ? 'active' : ''}`}
                >
                  <InspectIcn size="20" />
                </button>
              </Tip>
            )}
          </TipGroup>
        </div>
        <div className={css(OptionToolBarStyle.option_section)}>
          <StyleSegmentControl
            width={130}
            wideTab
            show={['icn']}
            tipPlace="bottom"
            defaultActive={breakpoint}
            onChange={handleBreakpointChange}
            className={css(ut.mr2)}
            options={[
              {
                icn: <span className={css(OptionToolBarStyle.respIcnWrp)}><MobileIcon size={23} /></span>,
                label: 'sm',
                tip: 'Small Screen View',
              },
              {
                icn: <span className={css(OptionToolBarStyle.respIcnWrp)}><TabletIcon size={22} /></span>,
                label: 'md',
                tip: 'Medium Screen View',
              },
              {
                icn: <span className={css(OptionToolBarStyle.respIcnWrp)}><LaptopIcn size={29} stroke={1.6} /></span>,
                label: 'lg',
                tip: 'Large Screen View',
              },
            ]}
          />

          <Downmenu
            place="bottom-end"
            onShow={() => setResponsiveMenu(true)}
            onHide={() => setResponsiveMenu(false)}
          >
            <button
              className={`${css([OptionToolBarStyle.icn_btn, ut.icn_hover])} ${responsiveMenu ? 'active' : ''}`}
              type="button"
            >
              <EllipsisIcon size="38" />
            </button>
            <BreakpointSizeControl />
          </Downmenu>

          <div className={css(OptionToolBarStyle.border_right)} />

          <FormBuilderHistory />
          <div className={css(OptionToolBarStyle.border_right)} />
          <Tip msg="Builder Settings">
            <button
              data-testid="custom-css-js"
              className={`${css([OptionToolBarStyle.icn_btn, ut.icn_hover])}`}
              onClick={() => setModal(true)}
              type="button"
            >
              <SettingsIcn size={22} />
            </button>
          </Tip>

          <div className={css(OptionToolBarStyle.border_right)} />

          <div className={css(ut.flxc)}>
            {!isV2Form && (
              <Tip msg="Custom Styling">
                <NavLink
                  className={css([OptionToolBarStyle.icn_btn, ut.icn_hover, ({ isActive }) => (isActive ? 'active' : '')])}
                  to={`/form/builder/${formType}/${formID}/style`}
                >
                  <BrushIcn size="20" />
                </NavLink>
              </Tip>
            )}
            <StyleSegmentControl
              width={90}
              wideTab
              show={['icn']}
              tipPlace="bottom"
              defaultActive={colorScheme}
              onChange={handleColorSchemeSwitch}
              className={css(ut.mr2, { vy: (darkModeConfig?.darkModeSelector === '' && !darkModeConfig?.preferSystemColorScheme) ? 'hidden' : 'visible' })}
              options={[
                { icn: <LightIcn size="19" />, label: 'light', tip: 'Light Mode' },
                { icn: <DarkIcn size="19" />, label: 'dark', tip: 'Dark Mode' },
              ]}
            />
            <StyleSegmentControl
              borderRadius={10}
              width={180}
              show={['icn']}
              tipPlace="bottom"
              defaultActive={defaultRightPanel}
              options={[
                { icn: <EditIcn size="19" />, label: 'fld-settings', tip: 'Field Settings' },
                { icn: <BrushIcn size="15" />, label: 'theme-customize', tip: 'Theme Customization' },
              ]}
              onChange={handleRightPanel}
              wideTab
            />
          </div>
        </div>
      </div>
      <Modal
        md
        autoHeight
        show={modal}
        setModal={setModal}
        className="o-v"
        title={(
          <div className={css(OptionToolBarStyle.modalTitleBar)}>
            <StyleSegmentControl
              width={300}
              wideTab
              tipPlace="bottom"
              defaultActive={settingsModalTab}
              onChange={setSettingsModalTab}
              options={[
                { label: 'Builder Settings' },
                { label: 'Custom Code' },
              ]}
            />
          </div>
        )}
        closeOnOutsideClick={false}
      >
        <Grow open={settingsModalTab === 'Builder Settings'}><TableBuilderSettings /></Grow>
        <Grow open={settingsModalTab === 'Custom Code'}><CustomCodeEditor /></Grow>
      </Modal>
    </div>
  )
}

import loadable from '@loadable/component'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useFela } from 'react-fela'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { $breakpoint, $builderRightPanelScroll, $flags, $selectedFieldId } from '../../../GlobalStates/GlobalStates'
import AddIcon from '../../../Icons/AddIcon'
import { reCalculateFldHeights } from '../../../Utils/FormBuilderHelper'
import { select } from '../../../Utils/globalHelpers'
import ErrorBoundary from '../../ErrorBoundary'
import FieldSettingsLoader from '../../Loaders/FieldSettingsLoader'
import { removeUnuseStylesAndUpdateState } from '../../style-new/styleHelpers'
import StyleLayers from '../LeftBars/StyleLayers'

import ChevronDownIcn from '../../../Icons/ChevronDownIcn'
import Settings2Icn from '../../../Icons/Settings2Icn'
import Toolbar from '../LeftBars/Toolbar'
import { BuilderLeftPanelProps, ScrollEvent } from '../Types/BuilderLeftPanel.types'
import StyleSegmentControl from '../Utilities/StyleSegmentControl'
import builderLeftPanelStyles from './BuilderLeftPanel.styles'

// Loadable components
const FieldSettings = loadable(() => import('./FieldSettings'), {
  fallback: <FieldSettingsLoader />
})
const MultiStepSettings = loadable(() => import('../../CompSettings/MultiStepSettings'), {
  fallback: <FieldSettingsLoader />
})
const StepSettings = loadable(() => import('../../CompSettings/StepSettings'), {
  fallback: <FieldSettingsLoader />
})
const FieldsList = loadable(() => import('../../CompSettings/FieldsList'), {
  fallback: <FieldSettingsLoader />
})



function BuilderLeftPanel({ style, styleDispatch, addNewData, onToggle, isCollapsed }: BuilderLeftPanelProps) {
  const { pathname } = useLocation()
  const { formID, formType, '*': leftPanelUrl } = useParams()
  const leftBar = leftPanelUrl?.split('/')[0] || ''
  const { css } = useFela()
  const [flags, setFlags] = useAtom($flags)
  const selectedFldId = useAtomValue($selectedFieldId)
  // const { toolbarOff } = JSON.parse(localStorage.getItem('bit-form-config') || '{}')
  // const [showLeftPanel, setShowLeftPanel] = useState(!toolbarOff)
  const setScrollTop = useSetAtom($builderRightPanelScroll)
  const [brkPoint, setResponsiveView] = useAtom($breakpoint)
  const [defaultLeftPanel, setDefaultLeftPanel] = useState('Add Fields')
  const navigate = useNavigate()
  const path = `/form/builder/${formType}/${formID}`
  const { styleMode } = flags

  //  // Add panel visibility state
  // const [isPanelCollapsed, setIsPanelCollapsed] = useState(() => {
  //   const saved = localStorage.getItem('bit-form-config')
  //   return saved === 'true'
  // })



  useEffect(() => {
    // setSelectedFieldId(fieldKey)
    const settingsScroll = select('.settings')?.firstChild?.firstChild as HTMLElement
    if (settingsScroll && settingsScroll.scrollTop > 0) settingsScroll.scrollTop = 0

    if (leftBar.match(/add-fields/)) {
      setDefaultLeftPanel('Add Fields')
    }
    else if (leftBar.match(/fields-list|field-settings|step-settings|multi-step-settings/)) {
      if (flags.styleMode || flags.inspectMode) {
        setFlags(prvFlags => ({ ...prvFlags, styleMode: false, inspectMode: false }))
      }
      // setDefaultRightPanel('fld-settings')
      setDefaultLeftPanel('Field Options')
    }
    else if (leftBar.match(/themes|style|field-theme-customize|theme-customize/)) {
      if (!flags.styleMode) {
        setFlags(prvFlags => ({ ...prvFlags, styleMode: true }))
      }
      // setDefaultRightPanel('theme-customize')
      setDefaultLeftPanel('Style')
    }
  }, [leftBar])

  const onSettingScroll = ({ target: { scrollTop } }: ScrollEvent): void => {
    scrollTop > 20 ? setScrollTop(true) : setScrollTop(false)
  }


  const styleModeButtonHandler = () => {
    setFlags(prvFlags => {
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

  const fieldOptionsButtonHandler = () => {
    setFlags(prvFlags => {
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

  const addFieldButtonHandler = () => {
    setFlags(prvFlags => {
      return { ...prvFlags, styleMode: false, inspectMode: false }
    })
    navigate(`${path}/add-fields`, { replace: true })
    removeUnuseStylesAndUpdateState()
    reCalculateFldHeights()
  }
  const handleLeftPanel = (currentActive: string) => {
    if (currentActive === 'Add Fields') {
      addFieldButtonHandler()
    } else if (currentActive === 'Field Options') {
      fieldOptionsButtonHandler()
    }
    setDefaultLeftPanel(currentActive)
  }

  return (
    <div
      className={`${css(
        builderLeftPanelStyles.elmSettings,
        isCollapsed ? builderLeftPanelStyles.elmSettingsCollapsed : {}
      )} ${styleMode ? 'style-mode' : ''} left-bar-panel`}
    >
      {/* Toggle Button */}
      <button
        className={css(builderLeftPanelStyles.toggleButton)}
        onClick={onToggle}
        aria-label={isCollapsed ? 'Show left panel' : 'Hide left panel'}
        title={isCollapsed ? 'Show left panel' : 'Hide left panel'}
      >
        <ChevronDownIcn
          size={18}
          className={css(
            builderLeftPanelStyles.toggleIcon,
            isCollapsed && builderLeftPanelStyles.toggleIconRotated
          )}
        />
      </button>

      {!isCollapsed && (
        <>
          <StyleSegmentControl
            className={css(builderLeftPanelStyles.segmentMenuWrapper)}
            show={['icn', 'label']}
            tipPlace="bottom"
            defaultActive={defaultLeftPanel}
            options={[
              { icn: <AddIcon size={22} />, label: 'Add Fields', tip: 'Form Fields' },
              ...(!flags.styleMode ? [{
                icn: <Settings2Icn size={22} classNames={css({ tm: 'rotate(90deg)' })} />,
                label: 'Field Options',
                tip: 'Individual Field Settings'
              }] : [])
            ]}
            onChange={handleLeftPanel}
            wideTab
            variant="clean-tertiary-bottom-outline"
          />

          {styleMode ? <StyleLayers /> : (
            <div className="settings">
              <Scrollbars onScroll={onSettingScroll} autoHide>
                <ErrorBoundary resetKey={pathname}>
                  <Routes>
                    <Route path="add-fields" element={<Toolbar setNewData={addNewData} />} />
                    <Route path="fields-list" element={<FieldsList />} />
                    <Route path="field-settings/:fieldKey" element={<FieldSettings />} />
                    <Route path="multi-step-settings" element={<MultiStepSettings />} />
                    <Route path="step-settings" element={<StepSettings />} />
                  </Routes>
                </ErrorBoundary>
              </Scrollbars>
            </div>)
          }
        </>
      )}
    </div>
  )
}

export default BuilderLeftPanel

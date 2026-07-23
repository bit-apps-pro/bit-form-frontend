import loadable from '@loadable/component'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useFela } from 'react-fela'
import { Route, Routes, useLocation, useParams } from 'react-router-dom'
import { $breakpoint, $builderRightPanelScroll } from '../../../GlobalStates/GlobalStates'
import ChevronDownIcn from '../../../Icons/ChevronDownIcn'
import { select } from '../../../Utils/globalHelpers'
import ErrorBoundary from '../../ErrorBoundary'
import FieldSettingsLoader from '../../Loaders/FieldSettingsLoader'
import StyleCustomizeLoader from '../../Loaders/StyleCustomizeLoader'
import BuilderRightPanelStyles from './BuilderRightPanel.styles'

const FieldStyleCustomizeHOC = loadable(() => import('../../style-new/FieldStyleCustomize'), { fallback: <StyleCustomizeLoader /> })
const ThemeCustomize = loadable(() => import('../../style-new/ThemeCustomize'), { fallback: <StyleCustomizeLoader /> })
const MultiStepCustomize = loadable(() => import('../../style-new/MultistepCustomize'), { fallback: <StyleCustomizeLoader /> })
const ThemeGallery = loadable(() => import('../../UIv3/style-new/ThemeGallery'), { fallback: <FieldSettingsLoader /> })

// Type definitions
interface StyleDispatchAction {
  type: string
  payload?: any
}


interface BuilderRightPanelProps {
  style: Record<string, any>
  styleDispatch: (action: StyleDispatchAction) => void
  isCollapsed: boolean
  onToggle: () => void
}

function BuilderRightPanel({ style, styleDispatch, isCollapsed, onToggle }: BuilderRightPanelProps) {
  const { pathname } = useLocation()
  const { formID, '*': rightPanel } = useParams()
  const rightBar = rightPanel?.split('/')[0] || 'themes'
  const { css } = useFela()
  const setScrollTop = useSetAtom($builderRightPanelScroll)
  const [brkPoint, setResponsiveView] = useAtom($breakpoint)

  useEffect(() => {
    // setSelectedFieldId(fieldKey)
    const settingsScroll = select('.right-bar-panel')?.firstChild?.firstChild
    if (settingsScroll && settingsScroll.scrollTop > 0) settingsScroll.scrollTop = 0
  }, [rightBar])

  const onSettingScroll = ({ target: { scrollTop } }: any) => (scrollTop > 20 ? setScrollTop(true) : setScrollTop(false))

  return (
    <div id="theme-style-menu" className={css(
      BuilderRightPanelStyles.elmSettings,
      isCollapsed ? BuilderRightPanelStyles.elmSettingsCollapsed : {},
    )}>
      {/* Toggle Button */}
      <button
        className={css(BuilderRightPanelStyles.toggleButton)}
        onClick={onToggle}
        aria-label={isCollapsed ? 'Show right panel' : 'Hide right panel'}
        title={isCollapsed ? 'Show right panel' : 'Hide right panel'}
      >
        <ChevronDownIcn
          size={18}
          className={css(
            BuilderRightPanelStyles.toggleIcon,
            isCollapsed ? BuilderRightPanelStyles.toggleIconRotated : {}
          )}
        />
      </button>
      <div className="right-bar-panel">
        <Scrollbars onScroll={onSettingScroll} autoHide>
          <ErrorBoundary resetKey={pathname}>
            <Routes>
              <Route path="themes" element={<ThemeGallery />} />
              <Route path="theme-customize/:element" element={<ThemeCustomize />} />
              <Route path="theme-customize/multi-step/:element" element={<MultiStepCustomize />} />
              <Route path="field-theme-customize/:element/:fieldKey" element={<FieldStyleCustomizeHOC />} />


            </Routes>
          </ErrorBoundary>
          {/* </CSSTransition> */}
          {/* </TransitionGroup> */}
          <div className="mb-50" />
        </Scrollbars>
      </div>
    </div>
  )
}
export default BuilderRightPanel


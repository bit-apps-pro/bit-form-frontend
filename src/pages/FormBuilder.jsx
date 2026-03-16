/* eslint-disable no-param-reassign */
import loadable from '@loadable/component'
import merge from 'deepmerge-alt'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  StrictMode,
  createRef,
  useCallback,
  useDeferredValue,
  useEffect,
  useReducer,
  useState,
} from 'react'

import { useParams } from 'react-router-dom'
import { Bar, Container, Section } from 'react-simple-resizer'
import {
  $alertModal,
  $breakpoint, $breakpointSize,
  $builderHookStates, $builderSettings,
  $flags, $isNewThemeStyleLoaded,
  $newFormId, $proModal,
} from '../GlobalStates/GlobalStates'
import { $savedStylesAndVars } from '../GlobalStates/SavedStylesAndVars'
import { $staticStylesState } from '../GlobalStates/StaticStylesState'
import { $allStyles, $styles } from '../GlobalStates/StylesState'
import { $allThemeColors } from '../GlobalStates/ThemeColorsState'
import { $allThemeVars } from '../GlobalStates/ThemeVarsState'
import { RenderPortal } from '../RenderPortal'
import { addToBuilderHistory } from '../Utils/FormBuilderHelper'
import { bitCipher, isObjectEmpty, multiAssign } from '../Utils/Helpers'
import { JCOF, select } from '../Utils/globalHelpers'
import j2c from '../Utils/j2c.es6'
import BuilderRightPanel from '../components/CompSettings/BuilderRightPanel'
import DraggableModal from '../components/CompSettings/StyleCustomize/ChildComp/DraggableModal'
import { defaultTheme } from '../components/CompSettings/StyleCustomize/ThemeProvider_Old'
import ErrorBoundary from '../components/ErrorBoundary'
import GridLayoutLoader from '../components/Loaders/GridLayoutLoader'
import StyleLayerLoader from '../components/Loaders/StyleLayerLoader'
import ToolbarLoader from '../components/Loaders/ToolbarLoader'
import BuilderStepTabs from '../components/MultiStep/BuilderStepTabs'
import OptionToolBar from '../components/OptionToolBar'
import RenderCssInPortal from '../components/RenderCssInPortal'
import ConfirmModal from '../components/Utilities/ConfirmModal'
import ProModal from '../components/Utilities/ProModal'
import RenderThemeVarsAndFormCSS from '../components/style-new/RenderThemeVarsAndFormCSS'
import useSWROnce from '../hooks/useSWROnce'

const ToolBar = loadable(() => import('../components/LeftBars/Toolbar'), { fallback: <ToolbarLoader /> })
const StyleLayers = loadable(() => import('../components/LeftBars/StyleLayers'), { fallback: <StyleLayerLoader /> })
const GridLayout = loadable(() => import('../components/GridLayout'), { fallback: <GridLayoutLoader /> })

const styleReducer = (v1Styles, action) => {
  if (action.brkPoint === 'lg') {
    multiAssign(v1Styles, action.apply)
    sessionStorage.setItem('btcd-fs', bitCipher(j2c.sheet(v1Styles)))
    return { ...v1Styles }
  }
  if (action.brkPoint === 'md') {
    const st = v1Styles['@media only screen and (max-width:600px)'] || v1Styles['@media only screen and (max-width: 600px)']
    multiAssign(st, action.apply)
    sessionStorage.setItem('btcd-fs', bitCipher(j2c.sheet(v1Styles)))
    return { ...v1Styles }
  }
  if (action.brkPoint === 'sm') {
    const st = v1Styles['@media only screen and (max-width:400px)'] || v1Styles['@media only screen and (max-width: 400px)']
    multiAssign(st, action.apply)
    sessionStorage.setItem('btcd-fs', bitCipher(j2c.sheet(v1Styles)))
    return { ...v1Styles }
  }
  if (action.type === 'init') {
    return action.v1Style
  }
  return v1Styles
}

const LEFT_MENU_WIDTH = 180
const RIGHT_MENU_WIDTH = 300
const SPLIT_BAR = 8
const BUILDER_WIDTH = window.innerWidth - LEFT_MENU_WIDTH - RIGHT_MENU_WIDTH - (SPLIT_BAR * 2)

const FormBuilder = ({ isLoading }) => {
  const [proModal, setProModal] = useAtom($proModal)
  const newFormId = useAtomValue($newFormId)
  const { element, fieldKey, formType, formID: pramsFormId } = useParams()
  const isNewForm = formType !== 'edit'
  const formID = isNewForm ? newFormId : pramsFormId
  const { toolbarOff } = JSON.parse(localStorage.getItem('bit-form-config') || '{}')
  const [showToolBar, setShowToolbar] = useState(!toolbarOff)
  const [gridWidth, setGridWidth] = useState(BUILDER_WIDTH)
  const deferedGridWidth = useDeferredValue(gridWidth)
  const [newData, setNewData] = useState(null)
  const [brkPoint, setbrkPoint] = useAtom($breakpoint)
  const [isNewThemeStyleLoaded, setIsNewThemeStyleLoaded] = useAtom($isNewThemeStyleLoaded)
  const builderHookStates = useAtomValue($builderHookStates)
  const { styleMode } = useAtomValue($flags)
  const [v1Style, styleDispatch] = useReducer(styleReducer, defaultTheme(formID))
  const [styleLoading, setStyleLoading] = useState(!isNewForm)
  const [builderPointerEventNone, setBuilderPointerEventNone] = useState(false)
  const conRef = createRef(null)
  const setBreakpointSize = useSetAtom($breakpointSize)
  const [alertMdl, setAlertMdl] = useAtom($alertModal)
  const setStaticStylesState = useSetAtom($staticStylesState)
  const setAllThemeColors = useSetAtom($allThemeColors)
  const setAllThemeVars = useSetAtom($allThemeVars)
  const setAllStyles = useSetAtom($allStyles)
  const setSavedStylesAndVars = useSetAtom($savedStylesAndVars)
  const setBuilderSettings = useSetAtom($builderSettings)
  const styles = useAtomValue($styles)
  const { forceBuilderWidthToLG } = builderHookStates

  useSWROnce(['bitforms_form_helpers_state', formID], { formID }, {
    fetchCondition: !isNewForm,
    onSuccess: data => {
      setStyleLoading(false)
      if (!isObjectEmpty(styles)) return
      handleStyleStates(data)
    },
  })

  const handleStyleStates = data => {
    const fetchedBuilderHelperStates = data?.[0]?.builder_helper_state
    const oldStyles = fetchedBuilderHelperStates || {}
    const { themeVars: allThemeVarsStr, themeColors: allThemeColorsStr, style: allStylesStr, staticStyles: staticStylesStr } = oldStyles
    const allThemeVars = JCOF.parse(allThemeVarsStr)
    const allThemeColors = JCOF.parse(allThemeColorsStr)
    const allStyles = JCOF.parse(allStylesStr)
    if (staticStylesStr) {
      const staticStyles = JCOF.parse(staticStylesStr)
      setStaticStylesState(staticStyles)
    }

    setAllThemeVars(allThemeVars)
    setAllThemeColors(allThemeColors)
    setAllStyles(allStyles)
    setSavedStylesAndVars({ allThemeVars, allThemeColors, allStyles })
    setBreakpointSize(oldStyles.breakpointSize)
    setBuilderSettings(oldStyles.builderSettings)
    addToBuilderHistory({ state: { allThemeVars, allThemeColors, allStyles } }, false, 0)
    setIsNewThemeStyleLoaded(true)
  }

  // useEffect(() => {
  //   if (isNewForm) {
  //     setTimeout(() => {
  //       select('#update-btn').click()
  //     }, 100)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (!isNewThemeStyleLoaded) {
  //     if (brkPoint === 'md') {
  //       const st = v1Style['@media only screen and (max-width:600px)'] || v1Style['@media only screen and (max-width: 600px)']
  //       setStyleSheet(j2c.sheet(merge(v1Style, st)))
  //     } else if (brkPoint === 'sm') {
  //       const st = v1Style['@media only screen and (max-width:400px)'] || v1Style['@media only screen and (max-width: 400px)']
  //       setStyleSheet(j2c.sheet(merge(v1Style, st)))
  //     } else if (brkPoint === 'lg') {
  //       setStyleSheet(j2c.sheet(v1Style))
  //     }
  //   }
  // }, [brkPoint, v1Style])

  useEffect(() => { setbrkPoint('lg') }, [forceBuilderWidthToLG])

  useEffect(() => {
    const resizer = conRef.current.getResizer()
    const leftBarWidth = toolbarOff ? 0 : LEFT_MENU_WIDTH
    const rightBarWidth = 307
    const mobileSize = 400
    const tabletSize = 590
    setbrkPoint(brkPoint)

    if (brkPoint === 'lg') {
      resizer.resizeSection(0, { toSize: leftBarWidth })
      resizer.resizeSection(2, { toSize: rightBarWidth })
    } else if (brkPoint === 'md') {
      const dividedWidth = (window.innerWidth - tabletSize) / 2
      const s0 = dividedWidth - leftBarWidth
      const s2 = dividedWidth - rightBarWidth
      resizer.resizeSection(0, { toSize: leftBarWidth + s0 })
      resizer.resizeSection(2, { toSize: rightBarWidth + s2 })
    } else if (brkPoint === 'sm') {
      const dividedWidth = (window.innerWidth - mobileSize) / 2
      const s0 = dividedWidth - leftBarWidth
      const s2 = dividedWidth - rightBarWidth
      resizer.resizeSection(0, { toSize: leftBarWidth + s0 })
      resizer.resizeSection(2, { toSize: rightBarWidth + s2 })
    }
    conRef.current.applyResizer(resizer)
  }, [brkPoint, element, fieldKey, setbrkPoint, toolbarOff])

  useEffect(() => {
    const res = conRef.current.getResizer()
    if (showToolBar && res.getSectionSize(0) <= 160) {
      res.resizeSection(0, { toSize: 160 })
      localStorage.setItem('bit-form-config', JSON.stringify({ toolbarOff: false }))
      conRef.current.applyResizer(res)
    } else if (!showToolBar && res.getSectionSize(0) >= 160) {
      res.resizeSection(0, { toSize: 0 })
      localStorage.setItem('bit-form-config', JSON.stringify({ toolbarOff: true }))
      conRef.current.applyResizer(res)
    }
  }, [showToolBar])

  const styleProvider = useCallback(() => {
    if (!isNewThemeStyleLoaded) {
      if (brkPoint === 'md') {
        const st = v1Style['@media only screen and (max-width:600px)'] || v1Style['@media only screen and (max-width: 600px)']
        return merge(v1Style, st)
      }
      if (brkPoint === 'sm') {
        const st = v1Style['@media only screen and (max-width:400px)'] || v1Style['@media only screen and (max-width: 400px)']
        return merge(v1Style, st)
      }
    }
    return v1Style
  }, [brkPoint, isNewThemeStyleLoaded, v1Style])

  const addNewData = useCallback(ndata => setNewData(ndata), [])

  const onResize = useCallback(resizer => {
    if (resizer.isBarActivated(1)) {
      resizer.resizeSection(0, { toSize: resizer.getSectionSize(2) - 130 })
    }
  }, [])

  const onResizeActivate = () => {
    setBuilderPointerEventNone(true)
    select('.tool-sec').style.transition = 'flex-grow 0ms'
  }

  const afterResizing = () => {
    setBuilderPointerEventNone(false)
    select('.tool-sec').style.transition = 'flex-grow 500ms'
  }

  const handleResize = (paneWidth) => {
    setGridWidth(paneWidth)
    // const w = calculateFormGutter(isNewThemeStyleLoaded ? styles.form : v1Style, formID)

    // const gw = Math.round(paneWidth - w) // inner left-right padding
    // if (gw < builderBreakpoints.md) {
    //   setbrkPoint('sm')
    //   if (builderHelperStates.respectLGLayoutOrder) {
    //     startTransition(() => { setIsDraggable(false) })
    //   }
    // } else if (gw >= builderBreakpoints.md && gw < builderBreakpoints.lg) {
    //   setbrkPoint('md')
    //   if (builderHelperStates.respectLGLayoutOrder) {
    //     startTransition(() => { setIsDraggable(false) })
    //   }
    // } else if (gw >= builderBreakpoints.lg) {
    //   setbrkPoint('lg')
    //   startTransition(() => { setIsDraggable(true) })
    // }
  }

  const clsAlertMdl = () => {
    const tmpAlert = { ...alertMdl }
    tmpAlert.show = false
    setAlertMdl(tmpAlert)
  }

  return (
    <>
      <OptionToolBar
        setShowToolbar={setShowToolbar}
        showToolBar={showToolBar}
        isV2Form
      />
      <DraggableModal setBuilderPointerEventNone={setBuilderPointerEventNone} />
      <Container
        ref={conRef}
        style={{ height: '100vh' }}
        beforeApplyResizer={onResize}
        afterResizing={afterResizing}
        onActivate={onResizeActivate}
      >
        <Section
          className="tool-sec"
          defaultSize={showToolBar ? LEFT_MENU_WIDTH : 0}
        >
          <StrictMode>
            {styleMode ? <StyleLayers /> : <ToolBar setNewData={addNewData} />}
          </StrictMode>
        </Section>
        <Bar className="bar bar-l" />

        <Section
          onSizeChanged={handleResize}
          minSize={320}
          defaultSize={BUILDER_WIDTH}
        >
          <BuilderStepTabs />
          <StrictMode>
            {!isLoading && !styleLoading ? (
              <RenderPortal
                id="bit-grid-layout"
                style={{ width: gridWidth, height: 'calc(100% - 82px)', margin: '3px auto auto', overflow: 'hidden', pointerEvents: builderPointerEventNone ? 'none' : 'all' }}
              >
                <RenderThemeVarsAndFormCSS />
                <RenderCssInPortal />
                <ErrorBoundary>
                  <GridLayout
                    style={styleProvider()}
                    gridWidth={deferedGridWidth}
                    newData={newData}
                    setNewData={setNewData}
                    formType={formType}
                    formID={formID}
                    setAlertMdl={setAlertMdl}
                  />
                </ErrorBoundary>
              </RenderPortal>
            ) : <GridLayoutLoader />}

          </StrictMode>
        </Section>

        <Bar className="bar bar-r" />

        <Section id="settings-menu" defaultSize={RIGHT_MENU_WIDTH} minSize={100}>
          <StrictMode>
            <BuilderRightPanel
              style={styleProvider()}
              styleDispatch={styleDispatch}
              formID={formID}
            />
          </StrictMode>
        </Section>
      </Container>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="red"
        btnTxt="Close"
        show={alertMdl.show}
        cancelBtn={alertMdl.cancelBtn}
        close={clsAlertMdl}
        action={clsAlertMdl}
      // title="Sorry"
      >
        <div className="txt-center">{alertMdl.msg}</div>
      </ConfirmModal>
      <ProModal />
    </>
  )
}

export default FormBuilder

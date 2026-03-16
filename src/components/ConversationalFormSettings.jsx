/* eslint-disable no-param-reassign */
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
/*
  ⚠ Please don't remove this line, it's needed for the date picker documentation ⚠
  https://react-day-picker.js.org/
*/
import 'react-day-picker/dist/style.css'
/**
 * https://reactjsexample.com/google-keep-app-inspired-time-picker-for-react/
 */
import { hexToCSSFilter } from 'hex-to-css-filter'
import { useAtom, useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import {
  $allLayouts,
  $bits, $fields,
  $fieldsArr,
  $formId, $formInfo, $nestedLayouts, $updateBtn,
} from '../GlobalStates/GlobalStates'
import { deepCopy } from '../Utils/Helpers'
import { filterFieldTypesForConversationalForm } from '../Utils/StaticData/allStaticArrays'
import defaultConversationalSettings from '../Utils/StaticData/form-templates/defaultConversationalSettings'
import tutorialLinks from '../Utils/StaticData/tutorialLinks'
import { select } from '../Utils/globalHelpers'
import { __ } from '../Utils/i18nwrap'
import Grow from './CompSettings/StyleCustomize/ChildComp/Grow'
import ConversationalPreview from './ConversationalPreview'
import Accordions from './Utilities/Accordions'
import SingleToggle2 from './Utilities/SingleToggle2'
import TinyMCE from './Utilities/TinyMCE'
import { hslToHex } from './style-new/colorHelpers'
import { assignNestedObj } from './style-new/styleHelpers'
import ColorPickerUtil from './style-new/util-components/ColorPickerUtil'
import IconSettingsUtil from './style-new/util-components/IconSettingsUtil'

export default function ConversationalFormSettings() {
  const [updateBtn, setUpdateBtn] = useAtom($updateBtn)
  const allLayouts = useAtomValue($allLayouts)
  const fieldsArr = useAtomValue($fieldsArr)
  const [formInfo, setFormInfo] = useAtom($formInfo)
  const fields = useAtomValue($fields)
  const nestedLayouts = useAtomValue($nestedLayouts)
  const [stepFields, setStepFields] = useState([])
  const bits = useAtomValue($bits)
  // const [alertMdl, setAlertMdl] = useState({ show: false, msg: '' })
  const [currentStep, setCurrentStep] = useState('allSteps')
  const formID = useAtomValue($formId)
  const { css } = useFela()

  const { conversationalSettings, standaloneSettings = {} } = formInfo
  const { themeSettings, navigationSettings, stepListObject } = deepCopy(conversationalSettings || {})
  const allStepsSettings = stepListObject?.allSteps || {}
  const welcomePage = stepListObject?.welcomePage || {}
  const currentStepSettings = stepListObject?.[currentStep] || {}
  const wrpStyle = {}
  if (conversationalSettings?.enable) {
    wrpStyle.opacity = 1
    wrpStyle.pointerEvents = 'auto'
    wrpStyle.userSelect = 'auto'
  } else {
    wrpStyle.opacity = 0.6
    wrpStyle.pointerEvents = 'none'
    wrpStyle.userSelect = 'none'
  }

  const handleConversationalSettings = (path, val) => {
    setFormInfo(oldConf => create(oldConf, draftConf => {
      if (!draftConf.conversationalSettings) draftConf.conversationalSettings = defaultConversationalSettings(formID)
      assignNestedObj(draftConf.conversationalSettings, path, val)
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleButtonTextAndIconColor = (path, value) => {
    const hslaValueArr = value.match(/[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/gi)
    const hexValue = hslToHex(hslaValueArr[0], hslaValueArr[1], hslaValueArr[2])
    const filterValue = hexToCSSFilter(hexValue)
    setFormInfo(oldConf => create(oldConf, draftConf => {
      if (!draftConf.conversationalSettings) draftConf.conversationalSettings = defaultConversationalSettings(formID)
      assignNestedObj(draftConf.conversationalSettings, path, value)
      assignNestedObj(draftConf.conversationalSettings, 'stepSettings->buttonIconFilter', filterValue.filter)
    }))
  }

  const handleColorPickerAction = (path, val) => {
    if (typeof val === 'string') {
      handleConversationalSettings(path, val)
      return true
    }
    setFormInfo(oldConf => create(oldConf, draftConf => {
      if (!draftConf.conversationalSettings) draftConf.conversationalSettings = defaultConversationalSettings(formID)
      Object.keys(val).forEach((key) => {
        assignNestedObj(draftConf.conversationalSettings, `${path}->${key}`, val[key])
      })
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleConversationalLayout = (path, val) => {
    setFormInfo(oldConf => create(oldConf, draftConf => {
      if (path === 'enable') draftConf.conversationalSettings = defaultConversationalSettings(formID)
      if (val !== 'normal-layout' && !currentStepSettings?.layoutImage) {
        // integer number between 1 to 3
        const dynamicNumber = Math.floor(Math.random() * 3) + 1
        const layoutImagePath = `${bits.assetsURL}/../static/conversational/layout-image-${dynamicNumber}.jpg`
        assignNestedObj(draftConf.conversationalSettings, `stepListObject->${currentStep}->layoutImage`, layoutImagePath)
      }
      assignNestedObj(draftConf.conversationalSettings, path, val)
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  useEffect(() => {
    const allLyoutArr = Array.isArray(allLayouts) ? allLayouts : [{ layout: allLayouts }]
    const sortedFieldsArr = []
    allLyoutArr.forEach((layout) => {
      layout?.layout?.lg?.sort((a, b) => a.y - b.y)
      layout?.layout?.lg?.forEach((layObj) => {
        if (!filterFieldTypesForConversationalForm.includes(fields[layObj.i]?.typ)) {
          sortedFieldsArr.push({ ...fields[layObj.i], key: layObj.i })
        }
      })
    })
    setStepFields(sortedFieldsArr)
  }, [fields, nestedLayouts])

  useEffect(() => {
    if (conversationalSettings?.enable) {
      select('#update-btn')?.click()
    }
  }, [conversationalSettings?.enable])

  return (
    <div className="pos-rel">
      <div>
        <div className="flx mt-4">
          <h2 className="m-0">{__('Conversational Form Settings')}</h2>
          <SingleToggle2 name="status" action={e => handleConversationalSettings('enable', e.target.checked)} checked={conversationalSettings?.enable || false} className="ml-2 flx" />
        </div>
        <p className="mt-1">{__('Note: In the Conversational Form feature, certain fields such as Captcha, Payments, HTML, etc are currently not supported.')}</p>
        <h5 className="mt-3">
          {__('How to setup Conversational form:')}
          <a href={tutorialLinks.conversationalForm.link} target="_blank" rel="noreferrer" className="yt-txt ml-1 mr-1">
            {__('YouTube')}
          </a>
          <a href={tutorialLinks.conversationalFormDoc.link} target="_blank" rel="noreferrer" className="doc-txt">
            {__('Documentation')}
          </a>
        </h5>
      </div>
      <div style={wrpStyle} className={css(style.settingContent)}>
        <div className={css(style.settings)}>
          <Accordions
            customTitle={(
              <label>
                {/* <span className="mr-2"><LoginIcn size={20} /></span> */}
                {__('Theme settings')}
              </label>
            )}
            proProperty="themeSettings"
          >
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="label-accent-color">Accent color</label>
              <ColorPickerUtil
                id="button-text-color"
                value={themeSettings?.accentColor}
                onChangeHandler={val => handleConversationalSettings('themeSettings->accentColor', val.color)}
                clearHandler={() => handleConversationalSettings('themeSettings->accentColor', '')}
                allowImportant
                allowGradient={false}
                allowImage={false}
              />
            </div>
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="step-background">Page Background</label>
              <ColorPickerUtil
                id="step-background"
                value={themeSettings?.background || '#fff'}
                onChangeHandler={val => handleColorPickerAction('themeSettings->background', val)}
                allowImportant
                colorProp="background-color"
                allowVariable={false}
              />
            </div>
            {/* <div className={css(style.inputWrpr)}>
              <label htmlFor="label-font-size">Font size</label>
              <SizeControlUtil
                value={themeSettings?.fontSize}
                onChangeHandler={val => handleConversationalSettings('themeSettings->fontSize', val)}
                options={['px', 'em', 'rem']}
              />
            </div>
            <div className={css(style.inputWrpr)}>
              <label htmlFor="input-border">Input Border</label>
              <BorderControlUtil
                id="input-border-size"
                value={themeSettings?.border}
                onChangeHandler={val => handleConversationalSettings('themeSettings->border', val)}
              />
            </div> */}
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="theme-color">Label Text Color</label>
              <ColorPickerUtil
                id="label-text-color"
                value={themeSettings?.labelTextColor}
                onChangeHandler={val => handleConversationalSettings('themeSettings->labelTextColor', val.color)}
                clearHandler={() => handleConversationalSettings('themeSettings->labelTextColor', '')}
                allowImportant
                allowGradient={false}
                allowImage={false}
              />
            </div>
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="input-text-color">Input Text Color</label>
              <ColorPickerUtil
                id="input-text-color"
                value={themeSettings?.inputTextColor}
                onChangeHandler={val => handleConversationalSettings('themeSettings->inputTextColor', val.color)}
                clearHandler={() => handleConversationalSettings('themeSettings->inputTextColor', '')}
                allowImportant
                allowGradient={false}
                allowImage={false}
              />
            </div>
          </Accordions>
          <Accordions
            customTitle={(<label>{__('Conversational Steps settings')}</label>)}
            cls="mt-3"
            proProperty="conversationalSettings"
          >
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="step-list">Step List</label>
              <select
                id="step-list"
                aria-label=""
                name=""
                className="btcd-paper-inp w-6"
                onChange={(e) => setCurrentStep(e.target.value)}
                value={currentStep}
              >
                <option value="allSteps">All Steps</option>
                <option value="welcomePage">Wecome Page</option>
                {stepFields.map((field, index) => <option value={field.key}>{`Step-${index + 1} (${field.adminLbl || field?.lbl || field.key})`}</option>)}
              </select>
            </div>
            <Grow overflw="" open={currentStep !== 'allSteps'}>
              <div className={css(style.inputWrpr)}>
                <label className={css(style.label)} htmlFor="step-enable-toggle">{__('Enable')}</label>
                <SingleToggle2
                  name="status"
                  className="ml-2 flx"
                  action={e => handleConversationalSettings(`stepListObject->${currentStep}->enable`, e.target.checked)}
                  checked={typeof currentStepSettings?.enable !== 'undefined' ? currentStepSettings?.enable : true}
                />
              </div>
            </Grow>
            {/* <Grow overflw="" open={currentStep === 'allSteps'}>
              <div className={css(style.inputWrpr)}>
                <label className={css(style.label)} htmlFor="step-page-navigate">Page Navigate</label>
                <select
                  id="step-page-navigate"
                  aria-label="Page Navigate"
                  name="pageNavigate"
                  className="btcd-paper-inp w-6"
                  onChange={(e) => handleConversationalSettings('stepListObject->allSteps->pageNavigate', e.target.value)}
                  value={allStepsSettings?.pageNavigate}
                >
                  <option value="horizonatal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>
            </Grow> */}
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="step-layout">Layout</label>
              <select
                id="step-layout"
                aria-label="Layout"
                name="layout"
                className="btcd-paper-inp w-6"
                onChange={(e) => handleConversationalLayout(`stepListObject->${currentStep}->layout`, e.target.value)}
                value={currentStepSettings?.layout || allStepsSettings.layout}
              >
                <option value="normal-layout">Normal</option>
                <option value="compact-left-layout">Compact Left</option>
                <option value="compact-right-layout">Compact Right</option>
                <option value="padding-left-layout">Padding Left</option>
                <option value="padding-right-layout">Padding Right</option>
              </select>
            </div>
            <Grow overflw="" open={currentStep === 'welcomePage'}>

              <div className={css(style.inputWrpr)}>
                <label className={css(style.label)} htmlFor="welcome-title">
                  Title
                </label>
                <input
                  id="welcome-title"
                  aria-label="Title"
                  type="text"
                  placeholder="title"
                  name="title"
                  className="btcd-paper-inp w-6"
                  onChange={(e) => handleConversationalSettings('stepListObject->welcomePage->title', e.target.value)}
                  value={welcomePage?.title}
                />

              </div>
              <div className="mb-1">
                <label className={css(style.label)} htmlFor="welcome-content">Content:</label>
                <TinyMCE
                  id="welcome-content"
                  formFields={fieldsArr}
                  value={stepListObject?.welcomePage?.content}
                  onChangeHandler={val => handleConversationalSettings('stepListObject->welcomePage->content', val)}
                />
              </div>
            </Grow>
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="step-background">Step Background</label>
              <ColorPickerUtil
                id="step-background"
                value={currentStepSettings?.background || allStepsSettings.background}
                onChangeHandler={val => handleColorPickerAction(`stepListObject->${currentStep}->background`, val)}
                allowImportant
                colorProp="background-color"
                allowVariable={false}
              />
            </div>
            <Grow overflw="" open={(currentStepSettings?.layout || allStepsSettings.layout) !== 'normal-layout'}>
              <div className={css(style.inputWrpr)}>
                <label className={css(style.label)} htmlFor="step-layout-image">Layout Image</label>
                <IconSettingsUtil
                  id="step-layout-image"
                  iconSrc={currentStepSettings?.layoutImage || allStepsSettings.layoutImage}
                  setIconHandler={(imageSrc) => handleConversationalSettings(`stepListObject->${currentStep}->layoutImage`, imageSrc)}
                  removeIconHandler={() => handleConversationalSettings(`stepListObject->${currentStep}->layoutImage`, '')}
                  uploadLbl="Upload Image"
                  selected="Upload Image"
                />
              </div>
            </Grow>
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="skip-button-text"> Button text</label>
              <input
                id="skip-button-text"
                aria-label="Button text"
                type="text"
                placeholder="Skip"
                name="btnTxt"
                className="btcd-paper-inp w-6"
                onChange={(e) => handleConversationalSettings(`stepListObject->${currentStep}->btnTxt`, e.target.value)}
                value={currentStepSettings?.btnTxt || allStepsSettings.btnTxt}
              />
            </div>
            <Grow overflw="" open={currentStep !== 'welcomePage'}>
              <div className={css(style.inputWrpr)}>
                <label className={css(style.label)} htmlFor="ok-button-text">&quot;Next&quot; Button text</label>
                <input
                  id="next-button-text"
                  aria-label="Button text"
                  type="text"
                  placeholder="ex: Next"
                  name="nextBtnTxt"
                  className="btcd-paper-inp w-6"
                  onChange={(e) => handleConversationalSettings(`stepListObject->${currentStep}->nextBtnTxt`, e.target.value)}
                  value={currentStepSettings?.nextBtnTxt}
                />
              </div>
            </Grow>
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="step-hints">Step Hints</label>
              <input
                id="step-hints"
                aria-label="Button text"
                type="text"
                placeholder="Ok"
                name="stepHints"
                className="btcd-paper-inp w-6"
                onChange={(e) => handleConversationalSettings(`stepListObject->${currentStep}->stepHints`, e.target.value)}
                value={currentStepSettings?.stepHints}
              />
            </div>
            {/* <div className={css(style.inputWrpr)}>
              <label htmlFor="step-button-suf-icn">Step Button Icon(Trailing)</label>
              <IconSettingsUtil
                id="step-button-suf-icn"
                iconSrc={stepSettings?.btnSufIcn}
                setIconHandler={(imageSrc) => handleConversationalSettings('stepSettings->btnSufIcn', imageSrc)}
                removeIconHandler={() => handleConversationalSettings('stepSettings->btnSufIcn', '')}
                proProperty="btnSufIcn"
              />
            </div> */}
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="button-background">Button Background Color</label>
              <ColorPickerUtil
                id="button-background"
                value={currentStepSettings?.buttonBgColor || allStepsSettings.buttonBgColor}
                onChangeHandler={val => handleConversationalSettings(`stepListObject->${currentStep}->buttonBgColor`, val.color)}
                clearHandler={() => handleConversationalSettings(`stepListObject->${currentStep}->buttonBgColor`, '')}
                allowImportant
                allowGradient={false}
                allowImage={false}
                allowVariable={false}
              />
            </div>
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="button-text-color">Button Text Color</label>
              <ColorPickerUtil
                id="button-text-color"
                value={currentStepSettings?.buttonTextColor || allStepsSettings.buttonTextColor}
                onChangeHandler={val => handleButtonTextAndIconColor(`stepListObject->${currentStep}->buttonTextColor`, val.color)}
                clearHandler={() => handleConversationalSettings(`stepListObject->${currentStep}->buttonTextColor`, '')}
                allowImportant
                allowGradient={false}
                allowImage={false}
              />
            </div>
          </Accordions>

          <Accordions
            customTitle={(
              <label>
                {/* <span className="mr-2"><LoginIcn size={20} /></span> */}
                {__('Navigation')}
              </label>
            )}
            cls="mt-3"
            action={(e) => handleConversationalSettings('navigationSettings->show', e.target.checked)}
            checked={navigationSettings?.show}
            toggle
            proProperty="navigationSettings"
          >
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="show-label">Show Progress Label</label>
              <SingleToggle2 name="show-label" action={e => handleConversationalSettings('navigationSettings->showProgressLabel', e.target.checked)} checked={navigationSettings?.showProgressLabel} />
            </div>
            {
              navigationSettings?.showProgressLabel && (
                <div className={css(style.inputWrpr)}>
                  <label className={css(style.label)} htmlFor="progress-label">Progress Label</label>
                  <input
                    id="progress-label"
                    aria-label="Button text"
                    type="text"
                    placeholder="Start"
                    name="progressLabel"
                    className="btcd-paper-inp w-6"
                    onChange={(e) => handleConversationalSettings('navigationSettings->progressLabel', e.target.value)}
                    value={navigationSettings?.progressLabel}
                  />
                </div>
              )
            }

            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="show-progress-bar">Show Progress Bar</label>
              <SingleToggle2 name="show-progress-bar" action={e => handleConversationalSettings('navigationSettings->showProgressBar', e.target.checked)} checked={navigationSettings?.showProgressBar} />
            </div>
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="enable-nav-btn">Show Navigate Button</label>
              <SingleToggle2 name="enable-nav-btn" action={e => handleConversationalSettings('navigationSettings->showNavigateBtn', e.target.checked)} checked={navigationSettings?.showNavigateBtn} />
            </div>
            <div className={css(style.inputWrpr)}>
              <label className={css(style.label)} htmlFor="enable-branding">Show Branding</label>
              <SingleToggle2 name="enable-branding" action={e => handleConversationalSettings('navigationSettings->showBranding', e.target.checked)} checked={navigationSettings?.showBranding} />
            </div>
          </Accordions>
        </div>
        <ConversationalPreview
          conversationalSettings={conversationalSettings}
          standaloneSettings={standaloneSettings}
        />
      </div>
    </div >
  )
}

const style = {
  label: {
    fs: '14px',
  },
  inputWrpr: {
    dy: 'flex',
    jc: 'space-between',
    ai: 'center',
    mb: 5,
  },
  settingContent: {
    dy: 'flex',
    jc: 'space-between',
    mb: 5,
  },
  settings: {
    w: '45%',
    mw: '400px',
  },
  previewWrpr: {
    w: '100%',
    mx: 10,
    h: '80vh',
    b: '1px solid #ccc',
    brs: 10,
  },
}

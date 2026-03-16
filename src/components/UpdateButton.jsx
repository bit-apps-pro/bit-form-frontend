/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-expressions */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import {
  $additionalSettings,
  $breakpointSize,
  $builderHookStates,
  $builderSettings,
  $confirmations,
  $customCodes,
  $deletedFldKey,
  $fieldLabels,
  $fields,
  $flags,
  $formAbandonment,
  $formInfo,
  $formPermissions,
  $forms,
  $integrations,
  $mailTemplates,
  $newFormId,
  $pdfTemplates,
  $previewWindow,
  $reportId,
  $reportSelector,
  $reports,
  $selectedFieldId,
  $updateBtn,
  $workflows,
} from '../GlobalStates/GlobalStates'
import { $staticStylesState } from '../GlobalStates/StaticStylesState'
import { $allStyles, $styles } from '../GlobalStates/StylesState'
import { $allThemeColors } from '../GlobalStates/ThemeColorsState'
import { $allThemeVars } from '../GlobalStates/ThemeVarsState'
import { getCurrentFormUrl, getGeneratedConversationalStyleObject, reCalculateFldHeights } from '../Utils/FormBuilderHelper'
import { bitDecipher, generateAndSaveAtomicCss, isObjectEmpty, objectToCssText } from '../Utils/Helpers'
import { formsReducer } from '../Utils/Reducers'
import paymentFields from '../Utils/StaticData/paymentFields'
import { generateNestedLayoutCSSText } from '../Utils/atomicStyleGenarate'
import bitsFetch from '../Utils/bitsFetch'
import { JCOF, select, selectInGrid } from '../Utils/globalHelpers'
import { __ } from '../Utils/i18nwrap'
import navbar from '../styles/navbar.style'
import LoaderSm from './Loaders/LoaderSm'
import { jsObjtoCssStr, mergeOtherStylesWithAtomicCSS, removeUnuseStylesAndUpdateState, updateGoogleFontUrl } from './style-new/styleHelpers'

export default function UpdateButton({ componentMounted, modal, setModal }) {
  const navigate = useNavigate()
  const { page, formType, formID, '*': rightBarUrl } = useParams()
  const { css } = useFela()
  const [buttonText, setButtonText] = useState(formType === 'edit' ? `${__('Update')}` : `${__('Save')}`)
  const [savedFormId, setSavedFormId] = useState(formType === 'edit' ? formID : 0)
  const [buttonDisabled, setbuttonDisabled] = useState(false)
  const [deletedFldKey, setDeletedFldKey] = useAtom($deletedFldKey)
  const [fields, setFields] = useAtom($fields)
  const formInfo = useAtomValue($formInfo)
  const { formName, multiStepSettings } = formInfo
  const newFormId = useAtomValue($newFormId)
  const setAllForms = useSetAtom($forms)
  const setBuilderHookStates = useSetAtom($builderHookStates)
  const setFieldLabels = useSetAtom($fieldLabels)
  const resetUpdateBtn = useResetAtom($updateBtn)
  const setReports = useSetAtom($reports)
  const currentReport = useAtomValue($reportSelector)
  const [reportId, setReportId] = useAtom($reportId)
  const [mailTem, setMailTem] = useAtom($mailTemplates)
  const [pdfTem, setPdfTem] = useAtom($pdfTemplates)
  const [updateBtn, setUpdateBtn] = useAtom($updateBtn)
  const [workFlows, setworkFlows] = useAtom($workflows)
  const [integrations, setIntegration] = useAtom($integrations)
  const [additional, setAdditional] = useAtom($additionalSettings)
  const [confirmations, setConfirmations] = useAtom($confirmations)
  const [formPermissions, setFormPermissions] = useAtom($formPermissions)
  const styles = useAtomValue($styles)
  const setAllThemeColors = useSetAtom($allThemeColors)
  const setAllThemeVars = useSetAtom($allThemeVars)
  const setAllStyles = useSetAtom($allStyles)
  const setSelectedFieldId = useSetAtom($selectedFieldId)
  const builderSettings = useAtomValue($builderSettings)
  const staticStylesState = useAtomValue($staticStylesState)
  const breakpointSize = useAtomValue($breakpointSize)
  const customCodes = useAtomValue($customCodes)
  const flags = useAtomValue($flags)
  const formAbandonment = useAtomValue($formAbandonment)
  const previewWindow = useAtomValue($previewWindow)
  const { staticStyles } = staticStylesState

  useEffect(() => {
    if (integrations[integrations.length - 1]?.newItegration || integrations[integrations.length - 1]?.editItegration) {
      const newIntegrations = create(integrations, draft => { draft.pop() })
      setIntegration(newIntegrations)
      saveForm('integrations', newIntegrations)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrations])

  useEffect(() => {
    if (mailTem[mailTem.length - 1]?.updateTem) {
      const newTem = create(mailTem, draft => {
        draft.pop()
      })
      setMailTem(newTem)
      saveForm('email-template', newTem)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailTem])

  useEffect(() => {
    if (pdfTem[pdfTem.length - 1]?.updateTem) {
      const newTem = create(pdfTem, draft => {
        draft.pop()
      })
      setPdfTem(newTem)
      saveForm('pdf-template', newTem)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfTem])

  const updateBtnEvent = e => {
    if ((e.key === 's' || e.key === 'S') && e.ctrlKey) {
      e.preventDefault()
      if (!updateBtn.disabled && !buttonDisabled) {
        saveOrUpdateForm()
      }
      return false
    }
  }

  const closeTabOrBrowserEvent = e => {
    if (updateBtn.unsaved) {
      const event = e
      event.preventDefault()
      event.returnValue = 'Are you sure you want to exit?'
      return event.returnValue
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', updateBtnEvent)
    const iFrameDocument = document.getElementById('bit-grid-layout')?.contentDocument
    iFrameDocument?.addEventListener('keydown', updateBtnEvent)
    window.addEventListener('beforeunload', closeTabOrBrowserEvent)
    return () => {
      document.removeEventListener('keydown', updateBtnEvent)
      iFrameDocument?.removeEventListener('keydown', updateBtnEvent)
      window.removeEventListener('beforeunload', closeTabOrBrowserEvent)
    }
  }, [])

  const checkUpdateBtnErrors = () => {
    if (updateBtn.errors) {
      const lastErr = updateBtn.errors[updateBtn.errors.length - 1]
      if (lastErr.errorMsg) toast.error(lastErr.errorMsg)
      else toast.error(__('Please fix the errors'))
      if (lastErr.errorUrl) {
        const currentFormUrl = getCurrentFormUrl()
        navigate(`${currentFormUrl}/${lastErr.errorUrl}`)
      }
      if (lastErr.fieldKey) {
        setSelectedFieldId(lastErr.fieldKey)
        setTimeout(() => {
          selectInGrid(`[data-key="${lastErr.fieldKey}"]`)?.focus()
        }, 500)
      }
      return true
    }
    return false
  }

  const saveOrUpdateForm = btnTyp => {
    const saveBtn = select('#secondary-update-btn')
    if (flags.styleMode) {
      reCalculateFldHeights()
    }
    if (saveBtn) {
      saveBtn.click()
    } else if (btnTyp === 'update-btn') {
      if (checkUpdateBtnErrors()) return
      saveForm()
    } else {
      select('#update-btn').click()
    }
  }

  useEffect(() => { if (updateBtn.unsaved && buttonDisabled) setbuttonDisabled(false) }, [updateBtn])

  const checkSubmitBtn = () => {
    const btns = Object.values(fields).filter(fld => fld.typ === 'button' && fld.btnTyp === 'submit')
    const payFields = fields ? Object.values(fields).filter(field => paymentFields.includes(field.typ)) : []
    return (payFields.length > 0 || btns.length > 0)
  }

  const saveForm = async (type, updatedData) => {
    if (savedFormId) setbuttonDisabled(true)
    // setTimeout to let React render the updated UI (show loader)
    setTimeout(() => {
      let mailTemplates = mailTem
      let pdfTemplates = pdfTem
      let additionalSettings = additional
      let allIntegrations = integrations

      if (type === 'email-template') {
        mailTemplates = updatedData
      } else if (type === 'pdf-template') {
        pdfTemplates = updatedData
      } else if (type === 'additional') {
        additionalSettings = updatedData
      } else if (type === 'integrations') {
        allIntegrations = updatedData
      }
      if (!checkSubmitBtn()) {
        const mdl = { ...modal }
        mdl.show = true
        mdl.title = __('Sorry')
        mdl.btnTxt = __('Close')
        mdl.msg = __('Please add a submit button')
        mdl.cancelBtn = false
        setModal(mdl)
        setbuttonDisabled(false)
        return
      }

      // setUpdateBtn(oldUpdateBtn => ({ ...oldUpdateBtn, disabled: true, loading: true }))
      const isStyleNotLoaded = isObjectEmpty(styles) || styles === undefined

      const {
        layouts,
        nestedLayouts,
        lightThemeColors,
        darkThemeColors,
        lgLightThemeVars,
        lgDarkThemeVars,
        mdLightThemeVars,
        mdDarkThemeVars,
        smLightThemeVars,
        smDarkThemeVars,
        lgLightStyles,
        lgDarkStyles,
        mdLightStyles,
        mdDarkStyles,
        smLightStyles,
        smDarkStyles,
      } = generateAndSaveAtomicCss(savedFormId)

      const allThemeColors = {
        lightThemeColors,
        darkThemeColors,
      }
      const allThemeVars = {
        lgLightThemeVars,
        lgDarkThemeVars,
        mdLightThemeVars,
        mdDarkThemeVars,
        smLightThemeVars,
        smDarkThemeVars,
      }
      let allStyles = {
        lgLightStyles,
        lgDarkStyles,
        mdLightStyles,
        mdDarkStyles,
        smLightStyles,
        smDarkStyles,
      }

      allStyles = updateGoogleFontUrl(allStyles)

      let formStyle = sessionStorage.getItem('btcd-fs')
      formStyle = formStyle && (bitDecipher(formStyle))

      const formData = {
        ...(savedFormId && { id: savedFormId }),
        ...(!savedFormId && { form_id: newFormId }),
        ...(savedFormId && { currentReport }),
        layout: layouts,
        nestedLayouts,
        formInfo,
        fields,
        // saveStyle && style obj
        form_name: formName,
        report_id: reportId.id,
        additional: additionalSettings,
        workFlows,
        formStyle,
        // style: isStyleNotLoaded ? undefined : allStyles,
        // themeColors: isStyleNotLoaded ? undefined : allThemeColors,
        // themeVars: isStyleNotLoaded ? undefined : allThemeVars,
        // atomicClassMap: isStyleNotLoaded ? undefined : atomicClassMap,
        ...(!isStyleNotLoaded && { style: JCOF.stringify(allStyles) }),
        ...(!isStyleNotLoaded && { staticStyles: JCOF.stringify(staticStylesState) }),
        ...(!isStyleNotLoaded && { themeColors: JCOF.stringify(allThemeColors) }),
        ...(!isStyleNotLoaded && { themeVars: JCOF.stringify(allThemeVars) }),
        breakpointSize,
        ...(customCodes.isFetched && { customCodes }),
        layoutChanged: sessionStorage.getItem('btcd-lc'),
        rowHeight: sessionStorage.getItem('btcd-rh'),
        formSettings: {
          formName,
          confirmation: confirmations,
          formPermissions,
          mailTem: mailTemplates,
          pdfTem: pdfTemplates,
          integrations: allIntegrations,
          ...(!isObjectEmpty(formAbandonment) && { formAbandonment }),
        },
        builderSettings,
      }
      if (savedFormId && deletedFldKey.length !== 0) {
        formData.deletedFldKey = deletedFldKey
      }
      const action = savedFormId ? 'bitforms_update_form' : 'bitforms_create_new_form'
      const formSavePromise = bitsFetch(formData, action)
        .then(response => {
          if (response?.success && componentMounted) {
            let { data } = response
            if (typeof data !== 'object') { data = JSON.parse(data) }
            setBuilderHookStates(prv => ({ ...prv, reRenderGridLayoutByRootLay: prv.reRenderGridLayoutByRootLay + 1 }))
            data?.form_content?.fields && setFields(data.form_content.fields)
            data?.formSettings?.confirmation && setConfirmations(data.formSettings.confirmation)
            data?.workFlows && setworkFlows(data.workFlows)
            data?.formSettings?.integrations && setIntegration(data.formSettings.integrations)
            data?.formSettings?.mailTem && setMailTem(data.formSettings.mailTem)

            data?.formSettings?.pdfTem && setPdfTem(data.formSettings.pdfTem)
            data?.additional && setAdditional(data.additional)
            data?.Labels && setFieldLabels(data.Labels)
            data?.reports && setReports(data?.reports || [])
            if (!reportId?.id && data?.form_content?.report_id) {
              setReportId(
                {
                  id: data?.form_content?.report_id,
                  isDefault: data?.form_content?.is_default || 0,
                },
              )
            }

            if (!isStyleNotLoaded) {
              setAllThemeColors(allThemeColors)
              setAllThemeVars(allThemeVars)
              setAllStyles(JCOF.parse(data?.style)) // updated style obj with updated confirmation id from backend
              removeUnuseStylesAndUpdateState()
            }

            setAllForms(allforms => formsReducer(allforms, {
              type: action === 'bitforms_create_new_form' ? 'add' : 'update',
              data: {
                formID: data.id,
                status: data.status !== '0',
                formName: data.form_name,
                shortcode: `bitform id='${data.id}'`,
                entries: data.entries,
                views: data.views,
                conversion: data.entries === 0 ? 0.00 : ((data.entries / (data.views === '0' ? 1 : data.views)) * 100).toPrecision(3),
                created_at: data.created_at,
              },
            }))
            resetUpdateBtn()
            setDeletedFldKey([])
            if (action === 'bitforms_create_new_form' && savedFormId === 0 && buttonText === __('Save')) {
              setSavedFormId(data.id)
              setButtonText(__('Update'))
              navigate(`/form/${page}/edit/${data.id}/${rightBarUrl}`, { replace: true })
            }

            setTimeout(() => generateAndSaveAtomicCss(data.id), 100)
            sessionStorage.removeItem('btcd-lc')
            sessionStorage.removeItem('btcd-fs')
            sessionStorage.removeItem('btcd-rh')
          } else if (!response?.success && response?.data === 'Token expired') {
            window.location.reload()
          } else if (!response?.success) {
            setTimeout(() => { window.location.reload() }, 2000)
          }
          return response
        })
        .catch(err => {
          console.error('form save error=', err)
        })
        .finally(() => {
          if (previewWindow && !previewWindow.closed) {
            setTimeout(() => {
              previewWindow.postMessage('REFRESH_PREVIEW', window.location.origin)
              previewWindow.location.reload()
            }, 100)
          }
        })

      if (savedFormId) {
        toast.promise(formSavePromise, {
          loading: __('Updating...', 'biform'),
          success: (res) => {
            setbuttonDisabled(false)
            return res?.data?.message || res?.data
          },
          error: () => {
            setbuttonDisabled(false)
            return __('Error occurred, Please try again.')
          },
        })
      }
      saveStandaloneCss()
      saveConversationalCss()
    }, 0)
  }

  const saveStandaloneCss = () => {
    if (!formInfo.standaloneSettings?.styles) return
    const stylesCss = jsObjtoCssStr(formInfo.standaloneSettings.styles)
    bitsFetch({ css: stylesCss, formID }, 'bitforms_save_standalone_css')
  }

  const saveConversationalCss = () => {
    if (!formInfo.conversationalSettings?.enable) return
    let stylesCss = objectToCssText({ ...staticStyles, ...getGeneratedConversationalStyleObject(savedFormId) })
    const { nestedLayoutStyleText } = generateNestedLayoutCSSText()
    if (nestedLayoutStyleText.lg) stylesCss += nestedLayoutStyleText.lg
    if (nestedLayoutStyleText.md) stylesCss += nestedLayoutStyleText.md
    if (nestedLayoutStyleText.sm) stylesCss += nestedLayoutStyleText.sm
    stylesCss += mergeOtherStylesWithAtomicCSS()
    bitsFetch({ css: stylesCss, formID }, 'bitforms_save_conversational_css')
  }

  return (
    <button
      id="update-btn"
      className={`${css(navbar.btn)} tooltip ${!updateBtn.unsaved ? css(navbar.visDisable) : ''}`}
      type="button"
      onClick={() => saveOrUpdateForm('update-btn')}
      disabled={updateBtn.disabled || buttonDisabled}
      style={{ '--tooltip-txt': `'${__('ctrl + s')}'` }}
    >
      {buttonText}
      {(updateBtn.loading || buttonDisabled) && <LoaderSm size={20} clr="white" className="ml-1" />}
    </button>
  )
}

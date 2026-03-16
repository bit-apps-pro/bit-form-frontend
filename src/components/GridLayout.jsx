/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import {
  Suspense,
  lazy, memo,
  startTransition,
  useDeferredValue,
  useEffect, useRef, useState,
} from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { default as ReactGridLayout } from 'react-grid-layout'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { $activeBuilderStep, $isDraggable } from '../GlobalStates/FormBuilderStates'
import {
  $breakpoint,
  $builderHelperStates,
  $builderHookStates,
  $contextMenu,
  $contextMenuRef,
  $deletedFldKey,
  $draggingField,
  $fields,
  $flags,
  $isNewThemeStyleLoaded,
  $layouts, $nestedLayouts, $proModal,
  $resizingFld,
  $selectedFieldId,
} from '../GlobalStates/GlobalStates'
import { $staticStylesState } from '../GlobalStates/StaticStylesState'
import { $stylesLgLight } from '../GlobalStates/StylesState'
import {
  addToBuilderHistory,
  builderBreakpoints,
  calculateFormGutter,
  cols,
  filterLayoutItem,
  filterNumber,
  fitAllLayoutItems, fitSpecificLayoutItem,
  getLatestState,
  getNestedFieldKeysFromNestedLayouts,
  getParentFieldKey,
  getTotalLayoutHeight,
  handleFieldExtraAttr,
  isLayoutSame,
  produceNewLayouts,
  propertyValueSumY,
  removeFormUpdateError,
} from '../Utils/FormBuilderHelper'
import { IS_PRO, deepCopy, getNewId, isFirefox, isObjectEmpty } from '../Utils/Helpers'
import paymentFields from '../Utils/StaticData/paymentFields'
import proHelperData from '../Utils/StaticData/proHelperData'
import { selectInGrid } from '../Utils/globalHelpers'
import { compactResponsiveLayouts, getLayoutItemCount } from '../Utils/gridLayoutHelper'
import { addNewFieldToGridLayout, generateFieldLblForHistory, generateNewFldName, getInitHeightsForResizingTextarea, setResizingWX } from '../Utils/gridLayoutHelpers'
import { __ } from '../Utils/i18nwrap'
import '../resource/css/grid-layout.css'
import useComponentVisible from './CompSettings/StyleCustomize/ChildComp/useComponentVisible'
import FieldContextMenu from './FieldContextMenu'
import FieldBlockWrapperLoader from './Loaders/FieldBlockWrapperLoader'
import StepContainer from './MultiStep/StepContainer'
import RenderGridLayoutStyle from './RenderGridLayoutStyle'
import { highlightElm, removeHighlight } from './style-new/styleHelpers'

const FieldBlockWrapper = lazy(() => import('./FieldBlockWrapper'))

const BUILDER_PADDING = { all: 5 }
const CUSTOM_SCROLLBAR_GUTTER = isFirefox() ? 20 : 12

// ⚠️ ALERT: Discuss with team before making any changes
function GridLayout({ newData, setNewData, style: v1Styles, gridWidth, setAlertMdl, formID }) {
  const { formType } = useParams()
  const setProModal = useSetAtom($proModal)
  const [fields, setFields] = useAtom($fields)
  const [rootLayouts, setRootLayouts] = useAtom($layouts)
  const [layouts, setLayouts] = useState(deepCopy(rootLayouts))
  const [selectedFieldId, setSelectedFieldId] = useAtom($selectedFieldId)
  const setDeletedFldKey = useSetAtom($deletedFldKey)
  const draggingField = useAtomValue($draggingField)
  const [flags, setFlags] = useAtom($flags)
  const builderHookStates = useAtomValue($builderHookStates)
  const isNewThemeStyleLoaded = useAtomValue($isNewThemeStyleLoaded)
  const [styles, setStyles] = useAtom($stylesLgLight)
  const [breakpoint, setBreakpoint] = useAtom($breakpoint)
  const [nestedLayouts, setNestedLayouts] = useAtom($nestedLayouts)
  const setStaticStyleState = useSetAtom($staticStylesState)
  const [gridContentMargin, setgridContentMargin] = useState([0, 0])
  const [resizingFld, setResizingFld] = useAtom($resizingFld)
  const [rowHeight, setRowHeight] = useState(1)
  const [builderHelperStates, setBuilderHelperStates] = useAtom($builderHelperStates)
  const isDraggableAtomVal = useAtomValue($isDraggable)
  const isDraggable = useDeferredValue(isDraggableAtomVal)
  const [contextMenu, setContextMenu] = useAtom($contextMenu)
  const setContextMenuRef = useSetAtom($contextMenuRef)
  const activeBuilderStep = useAtomValue($activeBuilderStep)
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)
  const navigate = useNavigate()
  const { reRenderGridLayoutByRootLay, reCalculateFieldHeights, reCalculateSpecificFldHeight } = builderHookStates
  const { fieldKey, counter: fieldChangeCounter } = reCalculateSpecificFldHeight
  const { styleMode, inspectMode } = flags
  const stopGridTransition = useRef(false)
  const delayRef = useRef(null)
  const [formGutter, setFormGutter] = useState(0)
  const elmCurrentHighlightedRef = useRef(null)
  const eventAbortControllerRef = useRef(null)
  const insptectModeTurnedOnRef = useRef(false)
  const location = useLocation()

  useEffect(() => { setLayouts(deepCopy(rootLayouts)) }, [reRenderGridLayoutByRootLay])
  useEffect(() => { setContextMenuRef({ ref, isComponentVisible, setIsComponentVisible }) }, [ref])
  // calculate fieldheight every time layout and field changes && stop layout transition when stylemode changes
  useEffect(() => {
    const fieldsCount = Object.keys(fields).length
    const latestLayouts = getLatestState('layouts')
    const layoutLgFieldsCount = getLayoutItemCount(latestLayouts)
    if (fieldsCount === layoutLgFieldsCount) {
      startTransition(() => {
        const nestedFields = getNestedFieldKeysFromNestedLayouts()
        const fieldsExistInLayouts = latestLayouts.lg.reduce((acc, lay) => {
          if (nestedFields.includes(lay.i)) {
            acc.push(lay.i)
          }
          return acc
        }, [])
        if (fieldsExistInLayouts.length) {
          let isLayoutChanged = false
          const newNestedLayouts = create(getLatestState('nestedLayouts'), draft => {
            fieldsExistInLayouts.forEach(fldKey => {
              if (!draft[fldKey]) return
              const tempFitLayout = fitAllLayoutItems(draft[fldKey])
              const tempCompactLayout = compactResponsiveLayouts(tempFitLayout, cols)
              if (!isLayoutSame(draft[fldKey], tempCompactLayout)) {
                draft[fldKey] = tempCompactLayout
                isLayoutChanged = true
              }
            })
          })
          if (isLayoutChanged) {
            setNestedLayouts(newNestedLayouts)
          }
        }
        // setNestedLayouts(prevNestedLayouts => create(prevNestedLayouts, draft => {
        //   Object.entries(draft).forEach(([fldKey, lay]) => {
        //     draft[fldKey] = fitAllLayoutItems(lay)
        //   })
        // }))
      })
      const nl = fitAllLayoutItems(latestLayouts)
      const nl2 = compactResponsiveLayouts(nl, cols)
      if (!isLayoutSame(latestLayouts, nl2)) {
        setLayouts(nl2)
        startTransition(() => {
          setRootLayouts(nl2)
        })
      }
    }

    if (styleMode) {
      stopGridTransition.current = true
    } else {
      setTimeout(() => { stopGridTransition.current = false }, 1)
    }
  }, [styleMode, reCalculateFieldHeights, breakpoint, fields, layouts, nestedLayouts])

  useEffect(() => {
    if (fieldKey) {
      const nl = fitSpecificLayoutItem(getLatestState('layouts'), fieldKey)
      setLayouts(nl)
      startTransition(() => {
        setRootLayouts(nl)
      })
    }
  }, [fieldChangeCounter])

  useEffect(() => { if (newData !== null) margeNewData() }, [newData])

  useEffect(() => {
    const latestLayouts = getLatestState('layouts')
    const lgLength = latestLayouts.lg.length
    const mdLength = latestLayouts.md.length
    const smLength = latestLayouts.sm.length
    if (breakpoint === 'md' && lgLength !== mdLength) {
      const newLayouts = produceNewLayouts(latestLayouts, ['md'], cols)
      setLayouts(newLayouts)
      startTransition(() => {
        setRootLayouts(newLayouts)
      })
    }
    if (breakpoint === 'sm' && lgLength !== smLength) {
      const newLayouts = produceNewLayouts(latestLayouts, ['sm'], cols)
      setLayouts(newLayouts)
      startTransition(() => {
        setRootLayouts(newLayouts)
      })
    }
  }, [breakpoint])

  useEffect(() => {
    const w = calculateFormGutter(isNewThemeStyleLoaded ? styles.form : v1Styles, formID)
    let h = 0

    if (!isNewThemeStyleLoaded) {
      if (v1Styles[`._frm-g-${formID}`]?.gap) {
        const gaps = v1Styles[`._frm-g-${formID}`].gap.replace(/px/g, '').split(' ')
        setgridContentMargin([Number(gaps[1]), Number(gaps[0])])
      }

      if (v1Styles[`.fld-lbl-${formID}`]?.['font-size']) {
        let lineHeight = 1
        if (v1Styles[`.fld-lbl-${formID}`]?.['line-height']) {
          lineHeight = filterNumber(v1Styles[`.fld-lbl-${formID}`]['line-height'])
        }
        h += filterNumber(v1Styles[`.fld-lbl-${formID}`]['font-size']) * lineHeight
      }
      if (v1Styles[`.fld-wrp-${formID}`]?.padding) { h += propertyValueSumY(v1Styles[`.fld-wrp-${formID}`].padding) }
      if (v1Styles[`input.fld-${formID},textarea.fld-${formID}`]?.margin) { h += propertyValueSumY(v1Styles[`input.fld-${formID},textarea.fld-${formID}`].margin) }
      if (v1Styles[`input.fld-${formID},textarea.fld-${formID}`]?.height) {
        h += filterNumber(v1Styles[`input.fld-${formID},textarea.fld-${formID}`].height)
      } else { h += 40 /* default field height */ }
      sessionStorage.setItem('btcd-rh', h / 2)
    }

    setFormGutter(w)

    // set row height in local
  }, [v1Styles, gridWidth, formID, styles])

  const getYPositionOfSubmitBtn = () => {
    const paymentFieldList = ['stripe', 'paypal', 'razorpay', 'mollie']
    const submitBtnFieldKey = Object.keys(fields).find(fldKey => (fields[fldKey].typ === 'button' && fields[fldKey].btnTyp === 'submit') || paymentFieldList.includes(fields[fldKey].typ))
    if (submitBtnFieldKey) {
      const submitBtnLayout = layouts?.lg?.find(lay => lay.i === submitBtnFieldKey)
      const yPos = submitBtnLayout ? submitBtnLayout.y : Infinity
      return yPos === 0 ? -1 : yPos
    }
    return Infinity
  }

  const margeNewData = () => {
    addNewField(newData.fieldData, newData.fieldSize, { x: newData.fieldSize?.x || 0, y: getYPositionOfSubmitBtn() })
    setNewData(null)
  }

  const removeFieldStyles = fldKeys => {
    setStyles(prevStyles => create(prevStyles, draftStyles => {
      fldKeys.forEach(fldKey => {
        delete draftStyles.fields[fldKey]
      })
    }))
  }

  const removeLayoutItem = fldKey => {
    const fldData = fields[fldKey]
    if (fldData?.typ === 'button' && fldData?.btnTyp === 'submit') {
      const payFields = fields ? Object.values(fields).filter(field => paymentFields.includes(field.typ)) : []
      if (!payFields.length) {
        setAlertMdl({ show: true, msg: __('Submit button cannot be removed'), cancelBtn: false })
        return false
      }
    }
    const isNestedField = nestedLayouts[fldKey]
    const isExistInLayout = layouts.lg.find(itm => itm.i === fldKey)
    const removedLay = {
      lg: layouts.lg.find(l => l.i === fldKey),
      md: layouts.md.find(l => l.i === fldKey),
      sm: layouts.sm.find(l => l.i === fldKey),
    }
    const nwLay = filterLayoutItem(fldKey, layouts)
    const removedFldKeys = [fldKey]
    setLayouts(nwLay)
    startTransition(() => {
      setRootLayouts(nwLay)
      if (isNestedField) {
        nestedLayouts[fldKey].lg.forEach(nestedField => {
          removedFldKeys.push(nestedField.i)
        })
        setNestedLayouts(prevNestedLayouts => create(prevNestedLayouts, draftNestedLayouts => {
          delete draftNestedLayouts[fldKey]
        }))
      }
      if (!isExistInLayout) {
        setNestedLayouts(prevNestedLayouts => create(prevNestedLayouts, draftNestedLayouts => {
          const parentFieldKey = getParentFieldKey(fldKey)
          draftNestedLayouts[parentFieldKey] = filterLayoutItem(fldKey, draftNestedLayouts[parentFieldKey])
        }))
      }
    })
    const tmpFields = create(fields, draftFields => {
      removedFldKeys.forEach(rmvfldKey => {
        delete draftFields[rmvfldKey]
      })
    })

    setFields(tmpFields)
    setSelectedFieldId(null)
    removeFieldStyles(removedFldKeys)
    setDeletedFldKey(prvDeleted => {
      const tmpFldKeys = [...prvDeleted]
      if (!tmpFldKeys.includes(fldKey)) {
        tmpFldKeys.push(fldKey)
      }

      return tmpFldKeys
    })
    sessionStorage.setItem('btcd-lc', '-')

    const fldType = fldData?.typ
    if (paymentFields.includes(fldType)) {
      setStaticStyleState(prevStaticStyleState => create(prevStaticStyleState, draftStaticStyleState => {
        delete draftStaticStyleState.staticStyles['.pos-rel']
        delete draftStaticStyleState.staticStyles['.form-loading::before']
        delete draftStaticStyleState.staticStyles['.form-loading::after']
        if (fldType === 'razorpay') delete draftStaticStyleState.staticStyles['.razorpay-checkout-frame']
      }))
    }

    // redirect to fields list
    // navigate.replace(`/form/builder/${formType}/${formID}/fields-list`)
    navigate(`/form/builder/${formType}/${formID}/fields-list`, { replace: true })

    // add to history
    startTransition(() => {
      const event = `${generateFieldLblForHistory(fldData)} removed`
      const type = 'remove_fld'
      const state = {
        fldKey,
        breakpoint,
        fldData,
        // layouts: nwLay,
        fields: tmpFields,
        allLayouts: getLatestState('allLayouts'),
        nestedLayouts: getLatestState('nestedLayouts'),
        styles: getLatestState('styles'),
      }
      addToBuilderHistory({ event, type, state })
    })

    //  remove if it has any update button errors
    removeFormUpdateError(fldKey)
  }

  function addNewField(fieldData, fieldSize, addPosition) {
    if (!handleFieldExtraAttr(fieldData)) return
    const { newLayouts, historyData } = addNewFieldToGridLayout(layouts, fieldData, fieldSize, addPosition)

    setLayouts(newLayouts)
    startTransition(() => {
      setRootLayouts(newLayouts)
      historyData.state.allLayouts = getLatestState('allLayouts')
      addToBuilderHistory(historyData)
    })
  }

  const cloneLayoutItem = fldKey => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.fieldClone })
      return
    }
    const fieldData = fields[fldKey]
    if (!handleFieldExtraAttr(fieldData)) return
    const isNestedField = nestedLayouts[fldKey]
    const isExistInLayout = layouts.lg.find(itm => itm.i === fldKey)
    const cloneFldKeys = [fldKey]
    if (isNestedField) {
      nestedLayouts[fldKey].lg.forEach(nestedField => {
        cloneFldKeys.push(nestedField.i)
      })
      // check cloneFldKeys with handleFieldExtraAttr
      const isNestedFieldValid = cloneFldKeys.every(fk => handleFieldExtraAttr(fields[fk]))
      if (!isNestedFieldValid) return
    }
    let uniqueFldId = getNewId(fields)
    // const newBlk = `b${formID}-${uniqueFldId}`

    // clone field
    const clonedNewFieldKey = {}
    const oldFields = create(fields, draft => {
      cloneFldKeys.forEach(fldKeyToClone => {
        const fldData = draft[fldKeyToClone]
        const newBlk = `b${formID}-${uniqueFldId}`
        uniqueFldId += 1
        clonedNewFieldKey[fldKeyToClone] = newBlk
        const newFldName = generateNewFldName(fldData.fieldName, fldKeyToClone, newBlk)
        draft[newBlk] = { ...fldData, fieldName: newFldName }
      })
    })
    setFields(oldFields)

    // clone style
    setStyles(preStyles => create(preStyles, draftStyle => {
      cloneFldKeys.forEach(fldKeyToClone => {
        const fldStyle = draftStyle.fields[fldKeyToClone]
        const fldClasses = fldStyle.classes
        const newBlk = clonedNewFieldKey[fldKeyToClone]
        draftStyle.fields[newBlk] = { ...fldStyle }
        draftStyle.fields[newBlk].classes = {}
        Object.keys(fldClasses).forEach(cls => {
          const newClassName = cls.replaceAll(fldKeyToClone, newBlk)
          draftStyle.fields[newBlk].classes[newClassName] = fldClasses[cls]
        })
      })
    }))

    const newLayItem = {}

    const allBreakpoints = ['sm', 'md', 'lg']
    startTransition(() => {
      if (isNestedField) {
        setNestedLayouts(prevNestedLayouts => create(prevNestedLayouts, draftNestedLayouts => {
          const newFieldKey = clonedNewFieldKey[fldKey]
          const prevLayout = prevNestedLayouts[fldKey]
          draftNestedLayouts[newFieldKey] = deepCopy(prevLayout)
          allBreakpoints.forEach(brkpnt => {
            draftNestedLayouts[newFieldKey][brkpnt].forEach((nestedField, indx) => {
              const newBlk = clonedNewFieldKey[nestedField.i]
              draftNestedLayouts[newFieldKey][brkpnt][indx].i = newBlk
            })
          })
        }))
      } else if (!isExistInLayout) {
        setNestedLayouts(prevNestedLayouts => create(prevNestedLayouts, draftNestedLayouts => {
          allBreakpoints.forEach(brkpnt => {
            const parentFieldKey = getParentFieldKey(fldKey)
            const layIndx = draftNestedLayouts[parentFieldKey][brkpnt].findIndex(lay => lay.i === fldKey)
            const { y, h } = draftNestedLayouts[parentFieldKey][brkpnt][layIndx]
            const newFieldKey = clonedNewFieldKey[fldKey]
            const newLayoutItem = { ...draftNestedLayouts[parentFieldKey][brkpnt][layIndx], i: newFieldKey, y: y + h }
            newLayItem[brkpnt] = newLayoutItem
            draftNestedLayouts[parentFieldKey][brkpnt].splice(layIndx + 1, 0, newLayoutItem)
          })
        }))
      }
    })
    let tmpLayouts = layouts
    if (isExistInLayout) {
      tmpLayouts = create(layouts, draft => {
        allBreakpoints.forEach(brkpnt => {
          const layIndx = layouts[brkpnt].findIndex(lay => lay.i === fldKey)
          const { y, h } = layouts[brkpnt][layIndx]
          const newBlk = clonedNewFieldKey[fldKey]
          const newLayoutItem = { ...layouts[brkpnt][layIndx], i: newBlk, y: y + h }
          newLayItem[brkpnt] = newLayoutItem
          draft[brkpnt].splice(layIndx + 1, 0, newLayoutItem)
        })
      })
      setLayouts(tmpLayouts)
      startTransition(() => {
        setRootLayouts(tmpLayouts)
      })
    }

    sessionStorage.setItem('btcd-lc', '-')
    const newBlk = clonedNewFieldKey[fldKey]
    setTimeout(() => {
      selectInGrid(`[data-key="${newBlk}"]`)?.focus()
      // .scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 500)

    // add to history
    startTransition(() => {
      const event = `${generateFieldLblForHistory(fieldData)} cloned`
      const type = 'clone_fld'
      const state = {
        fldKey: newBlk,
        breakpoint,
        fieldData,
        // layouts: tmpLayouts,
        fields: oldFields,
        allLayouts: getLatestState('allLayouts'),
        nestedLayouts: getLatestState('nestedLayouts'),
        styles: getLatestState('styles'),
      }
      addToBuilderHistory({ event, type, state })
    })

    resetContextMenu()
  }

  const onDrop = (lay, dropPosition) => {
    addNewField(draggingField.fieldData, draggingField.fieldSize, dropPosition)
  }

  const handleLayoutChange = (lay) => {
    if (lay.findIndex(itm => itm.i === 'shadow_block') < 0) {
      setLayouts(prevLayouts => ({ ...prevLayouts, [breakpoint]: lay }))
      startTransition(() => {
        setRootLayouts(prevLayouts => {
          if (prevLayouts[breakpoint].length === lay.length) {
            return { ...prevLayouts, [breakpoint]: lay }
          }
          return prevLayouts
        })
        if (breakpoint !== 'lg') {
          setBuilderHelperStates(prv => ({ ...prv, respectLGLayoutOrder: false }))
        }
      })
      // addToBuilderHistory(setBuilderHistory, { event: `Layout changed`, state: { layouts: layoutsFromGrid, fldKey: layoutsFromGrid.lg[0].i } }, setUpdateBtn)
    }
  }

  const handleContextMenu = (e, fldKey) => {
    e.preventDefault()
    e.stopPropagation()
    calculatePositionForContextMenu(e, fldKey)
  }

  const calculatePositionForContextMenu = (e, fldKey) => {
    // 0 - left click, 1 - middle click, 2 - right click
    const { button: mouseBtnClicked } = e

    let x
    let y
    let right
    let bottom

    const topPos = ref.current.getBoundingClientRect().top + window.scrollY
    const leftPos = ref.current.getBoundingClientRect().left + window.scrollX

    const layoutWrapperElm = selectInGrid('#layout-wrapper')
    const rootW = Number(layoutWrapperElm.style.width.match(/\d+/gi))
    const rootH = Number(layoutWrapperElm.style.height.match(/\d+/gi))

    const menuWidth = 170
    const menuHeight = 200

    if (mouseBtnClicked === 0) {
      const downBtn = selectInGrid(`[data-key="${fldKey}"]`)?.querySelector('.blk-wrp-down-btn')
      const downBtnSize = 30
      const downBtnTop = downBtn.getBoundingClientRect().top + downBtnSize
      const downBtnLeft = downBtn.getBoundingClientRect().left

      x = (downBtnLeft - leftPos) + 5
      y = (downBtnTop - topPos) + 2

      right = (x + menuWidth) > rootW
      bottom = (y + menuHeight) > rootH

      if (right) {
        x = ((downBtnLeft + downBtnSize) - leftPos) - 148
      }

      if (bottom) {
        y = (downBtnTop - topPos) - (menuHeight + downBtnSize + 7)
      }

      if (selectedFieldId !== fldKey) {
        x += 3
      }

      if (isComponentVisible && contextMenu.fldKey === fldKey && contextMenu.x === x && contextMenu.y === y) {
        resetContextMenu()
        return
      }
    } else if (mouseBtnClicked === 2) {
      x = (e.clientX - leftPos) + 5
      y = e.clientY - topPos

      right = (x + menuWidth) > rootW
      bottom = (y + menuHeight) > rootH

      if (right) {
        x = (e.clientX - leftPos) - 150
      }

      if (bottom) {
        y = (e.clientY - topPos) - menuHeight
      }
    }

    setSelectedFieldId(fldKey)
    setContextMenu({ fldKey, x, y })
    setIsComponentVisible(true)
  }

  const resetContextMenu = () => {
    setContextMenu({})
    setIsComponentVisible(false)
  }

  const navigateToFieldSettings = () => {
    navigate(location.pathname.replace(/style\/.+|style/g, 'fs'), { replace: true })
    resetContextMenu()
  }

  const navigateToStyle = fldKey => {
    navigate(`/form/builder/${formType}/${formID}/field-theme-customize/quick-tweaks/${fldKey}`, { replace: true })
    resetContextMenu()
  }

  const handleFldBlockEvent = (fieldId) => {
    setSelectedFieldId(fieldId)
    if (!isObjectEmpty(contextMenu)) {
      setContextMenu({})
    }
    setResizingFalse()
    if (styleMode) return
    startTransition(() => {
      navigate(`/form/builder/${formType}/${formID}/field-settings/${fieldId}`)
    })
  }

  const highlightElmEvent = event => {
    const iFrameDocument = document.getElementById('bit-grid-layout').contentDocument
    if (iFrameDocument.elementsFromPoint) {
      const allPointedElements = iFrameDocument.elementsFromPoint(event.pageX, event.pageY)
      const elmOnMousePointer = allPointedElements.find(el => typeof el.className === 'string' && !el.className.startsWith('highlight-'))
      if (!elmOnMousePointer) return false
      if (elmCurrentHighlightedRef.current && elmOnMousePointer.isEqualNode(elmCurrentHighlightedRef.current)) return false
      let dataDevAttrFound = false
      if (elmOnMousePointer?.attributes?.length) {
        const attrLength = elmOnMousePointer.attributes.length
        for (let i = 0; i < attrLength; i += 1) {
          const { name: attrName, value: attrVal } = elmOnMousePointer.attributes[i]
          if (attrName.startsWith('data-dev-')) {
            removeHighlight()
            dataDevAttrFound = true
            elmCurrentHighlightedRef.current = elmOnMousePointer
            highlightElm(`[${attrName}="${attrVal}"]`)
            break
          }
        }
      }
      if (!dataDevAttrFound) {
        removeHighlight()
        elmCurrentHighlightedRef.current = null
      }
    }
  }

  const redirectStyleUrlOfHighlightedElm = () => {
    const highlightedElm = elmCurrentHighlightedRef.current
    if (highlightedElm?.attributes?.length) {
      const attrLength = highlightedElm.attributes.length
      for (let i = 0; i < attrLength; i += 1) {
        const { name: attrName, value: attrVal } = highlightedElm.attributes[i]
        if (attrName.startsWith('data-dev-')) {
          const styleUrlPart = attrName.replace('data-dev-', '')
          let styleUrl
          if (styleUrlPart.startsWith('_frm-')) {
            styleUrl = `/form/builder/${formType}/${formID}/theme-customize/${styleUrlPart}`
          } else if (styleUrlPart.startsWith('stp')) {
            styleUrl = `/form/builder/${formType}/${formID}/theme-customize/multi-step/${styleUrlPart}`
          } else {
            styleUrl = `/form/builder/${formType}/${formID}/field-theme-customize/${styleUrlPart}/${attrVal}`
          }
          navigate(styleUrl)
          setFlags(prvFlags => create(prvFlags, draft => {
            draft.inspectMode = false
          }))
          // setSelectedFieldId(attrVal)
          break
        }
      }
    }
  }

  useEffect(() => {
    if (inspectMode) {
      insptectModeTurnedOnRef.current = true
      const iFrameDocument = document.getElementById('bit-grid-layout').contentDocument
      eventAbortControllerRef.current = new AbortController()
      iFrameDocument.addEventListener('mousemove', highlightElmEvent, { signal: eventAbortControllerRef.current.signal })
      iFrameDocument.addEventListener('click', redirectStyleUrlOfHighlightedElm, { signal: eventAbortControllerRef.current.signal })
    } else if (!inspectMode && insptectModeTurnedOnRef.current) {
      eventAbortControllerRef.current.abort()
      removeHighlight()
    }
  }, [inspectMode])

  const setResizingFalse = () => {
    if (isObjectEmpty(resizingFld)) return
    if (delayRef.current !== null) {
      clearTimeout(delayRef.current)
    }

    delayRef.current = setTimeout(() => {
      setResizingFld({})
      delayRef.current = null
    }, 700)
  }

  const setRegenarateLayFlag = () => {
    sessionStorage.setItem('btcd-lc', '-')
    setResizingFalse()
  }

  const setResizingFldKey = (_, lay) => {
    const fldKey = lay.i
    setResizingFld({ fieldKey: fldKey, ...getInitHeightsForResizingTextarea(fldKey) })
  }

  return (
    <div
      style={{ width: gridWidth, display: 'inline-block' }}
      className="layout-wrapper"
      id="layout-wrapper"
      onDragOver={e => e.preventDefault()}
      onDragEnter={e => e.preventDefault()}
      onClick={resetContextMenu}
    >
      {stopGridTransition.current && <style>{'.layout *{transition:none!important}'}</style>}
      {styleMode && <RenderGridLayoutStyle />}

      <Scrollbars autoHide style={{ overflowX: 'hidden' }}>
        <div id={`f-${formID}`} style={{ padding: BUILDER_PADDING.all, margin: '19px 13px 400px 0', border: '1px solid lightblue' }} className={draggingField && breakpoint === 'lg' ? 'isDragging' : ''}>
          <div className={`_frm-bg-b${formID}`} data-dev-_frm-bg={formID}>
            <div className={`_frm-b${formID}`} data-dev-_frm={formID}>
              <StepContainer className={`step-continer-${formID}`}>
                {!styleMode ? (
                  <ReactGridLayout
                    width={gridWidth - (formGutter + BUILDER_PADDING.all + CUSTOM_SCROLLBAR_GUTTER)}
                    measureBeforeMount
                    compactType="vertical"
                    useCSSTransforms
                    isDroppable={draggingField !== null && breakpoint === 'lg'}
                    className="layout"
                    style={{ minHeight: draggingField ? getTotalLayoutHeight() + 40 : null }}
                    onDrop={onDrop}
                    resizeHandles={['e']}
                    droppingItem={draggingField?.fieldSize}
                    onLayoutChange={handleLayoutChange}
                    cols={cols[breakpoint]}
                    breakpoints={builderBreakpoints}
                    rowHeight={rowHeight}
                    isDraggable={isDraggable}
                    margin={gridContentMargin}
                    draggableCancel=".no-drg"
                    draggableHandle=".drag"
                    layout={layouts[breakpoint]}
                    onDragStart={setResizingFldKey}
                    onDrag={setResizingWX}
                    onDragStop={setRegenarateLayFlag}
                    onResizeStart={setResizingFldKey}
                    onResize={setResizingWX}
                    onResizeStop={setRegenarateLayFlag}
                  >
                    {layouts[breakpoint].map(layoutItem => (
                      <div
                        key={layoutItem.i}
                        data-key={layoutItem.i}
                        className={`blk ${layoutItem.i === selectedFieldId && 'itm-focus'}`}
                        onClick={() => handleFldBlockEvent(layoutItem.i)}
                        onKeyDown={() => handleFldBlockEvent(layoutItem.i)}
                        role="button"
                        tabIndex={0}
                        onContextMenu={e => handleContextMenu(e, layoutItem.i)}
                        data-testid={`${layoutItem.i}-fld-blk`}
                      >
                        <Suspense fallback={<FieldBlockWrapperLoader layout={layoutItem} />}>
                          <FieldBlockWrapper
                            {...{
                              layoutItem,
                              removeLayoutItem,
                              cloneLayoutItem,
                              navigateToFieldSettings,
                              navigateToStyle,
                              handleContextMenu,
                            }}
                          />
                        </Suspense>
                      </div>
                    ))}
                  </ReactGridLayout>
                ) : (
                  <div className="_frm-g">
                    {layouts[breakpoint].map(layoutItem => (
                      <div
                        key={layoutItem.i}
                        data-key={layoutItem.i}
                        className={layoutItem.i}
                        onClick={() => handleFldBlockEvent(layoutItem.i)}
                        onKeyDown={() => handleFldBlockEvent(layoutItem.i)}
                        role="button"
                        tabIndex={0}
                        onContextMenu={e => handleContextMenu(e, layoutItem.i)}
                      >
                        <Suspense fallback={<FieldBlockWrapperLoader layout={layoutItem} />}>
                          <FieldBlockWrapper
                            {...{
                              layoutItem,
                              removeLayoutItem,
                              cloneLayoutItem,
                              navigateToFieldSettings,
                              navigateToStyle,
                            }}
                          />
                        </Suspense>
                      </div>
                    ))}
                  </div>
                )}
              </StepContainer>
            </div>
          </div>
        </div>
      </Scrollbars>

      <div ref={ref} className="pos-rel">
        <FieldContextMenu
          isContextMenu
          isComponentVisible={isComponentVisible}
          setIsComponentVisible={setIsComponentVisible}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          resetContextMenu={resetContextMenu}
          navigateToFieldSettings={navigateToFieldSettings}
          navigateToStyle={navigateToStyle}
          cloneLayoutItem={cloneLayoutItem}
          removeLayoutItem={removeLayoutItem}
          className="right-click-context-menu"
        />
      </div>
    </div>
  )
}
export default memo(GridLayout)

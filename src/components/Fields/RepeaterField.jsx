import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { Suspense, memo, startTransition, useEffect, useRef, useState } from 'react'
import { default as ReactGridLayout } from 'react-grid-layout'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { $isDraggable } from '../../GlobalStates/FormBuilderStates'
import {
  $breakpoint,
  $builderHookStates,
  $contextMenu, $contextMenuRef,
  $draggingField, $fields,
  $flags,
  $nestedLayouts,
  $proModal,
  $resizingFld,
  $selectedFieldId,
} from '../../GlobalStates/GlobalStates'
import { addToBuilderHistory, fitSpecificLayoutItem, getLatestState, getNestedLayoutHeight, handleFieldExtraAttr, reCalculateFldHeights } from '../../Utils/FormBuilderHelper'
import { IS_PRO, deepCopy, isObjectEmpty } from '../../Utils/Helpers'
import proHelperData from '../../Utils/StaticData/proHelperData'
import { getCustomAttributes, getCustomClsName, selectInGrid } from '../../Utils/globalHelpers'
import {
  addNewFieldToGridLayout,
  cloneLayoutItem,
  removeLayoutItem, setResizingFldKey, setResizingWX,
} from '../../Utils/gridLayoutHelpers'
import FieldBlockWrapper from '../FieldBlockWrapper'
import InputWrapper from '../InputWrapper'
import FieldBlockWrapperLoader from '../Loaders/FieldBlockWrapperLoader'
import RenderHtml from '../Utilities/RenderHtml'
import RenderStyle from '../style-new/RenderStyle'
import { getAbsoluteSize } from '../style-new/styleHelpers'
import { __ } from '../../Utils/i18nwrap'

/* eslint-disable react/jsx-props-no-spreading */
function RepeaterField({
  fieldKey, attr: fieldData, styleClasses, formID,
}) {
  const { formType } = useParams()
  const styleClassesForRender = deepCopy(styleClasses)
  const [nestedLayouts, setNestedLayouts] = useAtom($nestedLayouts)
  const [gridNestedLayouts, setGridNestedLayouts] = useState(deepCopy(nestedLayouts[fieldKey] || { lg: [], md: [], sm: [] }))
  const [contextMenu, setContextMenu] = useAtom($contextMenu)
  const [selectedFieldId, setSelectedFieldId] = useAtom($selectedFieldId)
  const setProModal = useSetAtom($proModal)
  const fields = useAtomValue($fields)
  const { styleMode } = useAtomValue($flags)
  const [resizingFld, setResizingFld] = useAtom($resizingFld)
  const delayRef = useRef(null)
  // const breakpoint = useAtomValue($breakpoint)
  const { ref, isComponentVisible, setIsComponentVisible } = useAtomValue($contextMenuRef)
  const breakpoint = useAtomValue($breakpoint)
  const setIsDraggable = useSetAtom($isDraggable)
  const draggingField = useAtomValue($draggingField)
  const { recalculateNestedField } = useAtomValue($builderHookStates)
  const { fieldKey: changedFieldKey, parentFieldKey, counter: fieldChangeCounter } = recalculateNestedField
  const navigate = useNavigate()
  const location = useLocation()
  const { btnPosition } = fieldData

  useEffect(() => {
    if (fieldChangeCounter > 0 && fieldKey === parentFieldKey) {
      const nl = fitSpecificLayoutItem(gridNestedLayouts, changedFieldKey)
      setGridNestedLayouts(nl)
      startTransition(() => {
        setNestedLayouts(prv => create(prv, draft => {
          draft[fieldKey] = nl
        }))
        reCalculateFldHeights(fieldKey)
      })
    }
  }, [fieldChangeCounter, parentFieldKey, changedFieldKey])

  useEffect(() => {
    setGridNestedLayouts(deepCopy(nestedLayouts[fieldKey] || { lg: [], md: [], sm: [] }))
  }, [nestedLayouts[fieldKey]])

  const handleLayoutChange = (lay) => {
    if (lay.findIndex(itm => itm.i === 'shadow_block') < 0) {
      setGridNestedLayouts(prevLayouts => ({ ...prevLayouts, [breakpoint]: lay }))
      startTransition(() => {
        setNestedLayouts(prv => create(prv, draft => {
          if (draft?.[fieldKey]) draft[fieldKey][breakpoint] = lay
        }))
      })
      // addToBuilderHistory(setBuilderHistory, { event: `Layout changed`, state: { layouts: layoutsFromGrid, fldKey: layoutsFromGrid.lg[0].i } }, setUpdateBtn)
    }
  }

  const onDrop = (e, dropPosition) => {
    const dragFieldData = handleFieldExtraAttr(draggingField.fieldData, 'repeater')
    if (!dragFieldData) return
    const { newLayouts, historyData } = addNewFieldToGridLayout(gridNestedLayouts, dragFieldData, draggingField.fieldSize, dropPosition)
    setGridNestedLayouts(newLayouts)
    startTransition(() => {
      setNestedLayouts(prevLayouts => create(prevLayouts, draftLayouts => { draftLayouts[fieldKey] = newLayouts }))
      setIsDraggable(true)
      reCalculateFldHeights(fieldKey)
      historyData.state.nestedLayouts = getLatestState('nestedLayouts')
      addToBuilderHistory(historyData)
    })
  }
  const rptWrp = selectInGrid(`.${fieldKey}-rpt-wrp`)
  const rptWrpSizes = rptWrp && getAbsoluteSize(rptWrp)
  const rptWrpWidth = rptWrpSizes ? rptWrpSizes.width - (rptWrpSizes.paddingLeft + rptWrpSizes.paddingRight + rptWrpSizes.borderLeft + rptWrpSizes.borderRight) : 0

  const pairBtnWrp = selectInGrid(`.${fieldKey}-pair-btn-wrp`)
  const pairBtnWrpSizes = pairBtnWrp && getAbsoluteSize(pairBtnWrp)
  const pairBtnWrpWidth = pairBtnWrpSizes && ['row', 'row-reverse'].includes(btnPosition) ? pairBtnWrpSizes.width : 0

  const rptGridWrp = selectInGrid(`.${fieldKey}-rpt-grid-wrp`)
  const rptGridSizes = rptGridWrp && getAbsoluteSize(rptGridWrp)

  const inpWrpWidth = (rptWrpWidth - pairBtnWrpWidth) - (rptGridSizes ? (rptGridSizes.paddingLeft + rptGridSizes.paddingRight + rptGridSizes.borderLeft + rptGridSizes.borderRight) : 0)

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

  const handleContextMenu = (e, fldKey) => {
    e.preventDefault()
    e.stopPropagation()
    calculatePositionForContextMenu(e, fldKey)
  }

  const handleFldBlockEvent = (e, fieldId) => {
    e.stopPropagation()
    setSelectedFieldId(fieldId)
    if (!isObjectEmpty(contextMenu)) {
      setContextMenu({})
    }
    setResizingFalse()
    if (styleMode) return
    navigate(`/form/builder/${formType}/${formID}/field-settings/${fieldId}`)
  }

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

  const cloneNestedLayoutItem = fldKey => {
    if (!IS_PRO) {
      setProModal({ show: true, ...proHelperData.fieldClone })
      return
    }
    const fldData = fields[fldKey]
    if (!handleFieldExtraAttr(fldData)) return
    const { newLayouts } = cloneLayoutItem(fldKey, gridNestedLayouts)
    setGridNestedLayouts(newLayouts)
    startTransition(() => {
      setNestedLayouts(prevLayout => create(prevLayout, draftLayout => {
        draftLayout[fieldKey] = newLayouts
      }))
      reCalculateFldHeights(fieldKey)
    })
  }

  const removeNestedLayoutItem = fldKey => {
    const { newLayouts, historyData } = removeLayoutItem(fldKey, gridNestedLayouts)
    setGridNestedLayouts(newLayouts)
    startTransition(() => {
      setNestedLayouts(prevLayout => create(prevLayout, draftLayout => {
        draftLayout[fieldKey] = newLayouts
      }))
      reCalculateFldHeights(fieldKey)
      historyData.state.nestedLayouts = getLatestState('nestedLayouts')
      addToBuilderHistory(historyData)
    })
    navigate(`/form/builder/${formType}/${formID}/fields-list`, { replace: true })
  }

  return (
    <>
      <RenderStyle styleClasses={styleClassesForRender} />
      <InputWrapper
        formID={formID}
        fieldKey={fieldKey}
        fieldData={fieldData}
        noErrMsg
      >
        <div
          data-testid={`${fieldKey}-inp-fld-wrp`}
          data-dev-inp-fld-wrp={fieldKey}
          className={`${fieldKey}-inp-fld-wrp ${getCustomClsName(fieldKey, 'inp-fld-wrp')}`}
          {...getCustomAttributes(fieldKey, 'inp-fld-wrp')}
        >
          <div
            data-testid={`${fieldKey}-rpt-fld-wrp`}
            data-dev-rpt-fld-wrp={fieldKey}
            className={`${fieldKey}-rpt-fld-wrp ${getCustomClsName(fieldKey, 'rpt-fld-wrp')}`}
            {...getCustomAttributes(fieldKey, 'rpt-fld-wrp')}
          >
            <div
              data-testid={`${fieldKey}-rpt-wrp`}
              data-dev-rpt-wrp={fieldKey}
              className={`${fieldKey}-rpt-wrp ${getCustomClsName(fieldKey, 'rpt-wrp')}`}
              {...getCustomAttributes(fieldKey, 'rpt-wrp')}
            >
              <div
                data-testid={`${fieldKey}-rpt-grid-wrp`}
                data-dev-rpt-grid-wrp={fieldKey}
                className={`${fieldKey}-rpt-grid-wrp ${getCustomClsName(fieldKey, 'rpt-grid-wrp')}`}
                {...getCustomAttributes(fieldKey, 'rpt-grid-wrp')}
              >
                <div
                  style={{ width: inpWrpWidth, display: 'inline-block' }}
                  // className="layout-wrapper"
                  id={`${fieldKey}-layout-wrapper`}
                  onDragOver={e => e.preventDefault()}
                  onDragEnter={e => e.preventDefault()}
                  onMouseMove={() => startTransition(() => { setIsDraggable(false) })}
                  onMouseLeave={() => startTransition(() => { setIsDraggable(true) })}
                // onClick={resetContextMenu}
                >
                  {!styleMode ? (
                    <ReactGridLayout
                      width={inpWrpWidth}
                      measureBeforeMount
                      compactType="vertical"
                      useCSSTransforms
                      isDroppable={draggingField !== null && breakpoint === 'lg'}
                      className="layout"
                      style={{ minHeight: draggingField ? getNestedLayoutHeight() + 40 : null }}
                      onDrop={onDrop}
                      resizeHandles={['e']}
                      droppingItem={draggingField?.fieldSize}
                      onLayoutChange={handleLayoutChange}
                      cols={60}
                      rowHeight={1}
                      margin={[0, 0]}
                      draggableCancel=".no-drg"
                      draggableHandle=".drag"
                      layout={gridNestedLayouts?.[breakpoint] || []}
                      // onBreakpointChange={onBreakpointChange}
                      onDragStart={setResizingFldKey}
                      // onDrag={setResizingWX}
                      onDragStop={() => {
                        startTransition(() => {
                          setIsDraggable(true)
                          reCalculateFldHeights(fieldKey)
                          setResizingFalse()
                        })
                      }}
                      onResizeStart={setResizingFldKey}
                      onResize={setResizingWX}
                      onResizeStop={() => {
                        setResizingFalse()
                        reCalculateFldHeights(fieldKey)
                      }}
                    >
                      {gridNestedLayouts?.[breakpoint]?.map(layoutItem => (
                        <div
                          key={layoutItem.i}
                          data-key={layoutItem.i}
                          className={`blk ${layoutItem.i === selectedFieldId && 'itm-focus'}`}
                          onClick={(e) => handleFldBlockEvent(e, layoutItem.i)}
                          onKeyDown={(e) => handleFldBlockEvent(e, layoutItem.i)}
                          role="button"
                          tabIndex={0}
                          onContextMenu={e => handleContextMenu(e, layoutItem.i)}
                        >
                          <Suspense fallback={<FieldBlockWrapperLoader layout={layoutItem} />}>
                            <FieldBlockWrapper
                              {...{
                                layoutItem,
                                removeLayoutItem: removeNestedLayoutItem,
                                cloneLayoutItem: cloneNestedLayoutItem,
                                fields,
                                formID,
                                navigateToFieldSettings,
                                navigateToStyle,
                                handleContextMenu,
                                resizingFld,
                              }}
                            />
                          </Suspense>
                        </div>
                      ))}
                    </ReactGridLayout>
                  ) : (
                    <div className="_frm-g">
                      {gridNestedLayouts?.[breakpoint]?.map(layoutItem => (
                        <div
                          key={layoutItem.i}
                          data-key={layoutItem.i}
                          className={layoutItem.i}
                          onClick={(e) => handleFldBlockEvent(e, layoutItem.i)}
                          onKeyDown={(e) => handleFldBlockEvent(e, layoutItem.i)}
                          role="button"
                          tabIndex={0}
                          onContextMenu={e => handleContextMenu(e, layoutItem.i)}
                        >
                          <Suspense fallback={<FieldBlockWrapperLoader layout={layoutItem} />}>
                            <FieldBlockWrapper
                              {...{
                                layoutItem,
                                removeLayoutItem: removeNestedLayoutItem,
                                cloneLayoutItem: cloneNestedLayoutItem,
                                fields,
                                formID,
                                navigateToFieldSettings,
                                navigateToStyle,
                                handleContextMenu,
                                resizingFld,
                              }}
                            />
                          </Suspense>
                        </div>
                      ))}
                    </div>
                  )}

                  {!gridNestedLayouts?.[breakpoint]?.length && !draggingField && (
                    <div className="empty-layout">
                      <div className="empty-layout-msg">
                        <div className="empty-layout-msg-txt">
                          <span>{__("Drag and drop fields here")}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                data-testid={`${fieldKey}-pair-btn-wrp`}
                data-dev-pair-btn-wrp={fieldKey}
                className={`${fieldKey}-pair-btn-wrp ${getCustomClsName(fieldKey, 'pair-btn-wrp')}`}
                {...getCustomAttributes(fieldKey, 'pair-btn-wrp')}
              >
                {
                  fieldData.addBtn.show && (
                    <button
                      data-testid={fieldKey}
                      data-dev-rpt-add-btn={fieldKey}
                      className={`${fieldKey}-rpt-add-btn ${getCustomClsName(fieldKey, 'rpt-add-btn')}`}
                      {...getCustomAttributes(fieldKey, 'rpt-add-btn')}
                      // eslint-disable-next-line react/button-has-type
                      type="button"
                    >
                      {fieldData.addBtnPreIcn && (
                        <img
                          data-testid={`${fieldKey}-rpt-add-btn-pre-i`}
                          data-dev-rpt-add-btn-pre-i={fieldKey}
                          className={`${fieldKey}-rpt-add-btn-pre-i ${getCustomClsName(fieldKey, 'rpt-add-btn-pre-i')}`}
                          src={`${fieldData.addBtnPreIcn}`}
                          alt=""
                          {...getCustomAttributes(fieldKey, 'rpt-add-btn-pre-i')}
                        />
                      )}
                      <RenderHtml html={fieldData.addBtn.txt || ''} />
                      {fieldData.addBtnSufIcn && (
                        <img
                          data-testid={`${fieldKey}-rpt-add-btn-suf-i`}
                          data-dev-rpt-add-btn-suf-i={fieldKey}
                          className={`${fieldKey}-rpt-add-btn-suf-i ${getCustomClsName(fieldKey, 'rpt-add-btn-suf-i')}`}
                          src={fieldData.addBtnSufIcn}
                          alt=""
                          {...getCustomAttributes(fieldKey, 'rpt-add-btn-suf-i')}
                        />
                      )}
                    </button>
                  )
                }
                <button
                  data-testid={fieldKey}
                  data-dev-rpt-rmv-btn={fieldKey}
                  className={`${fieldKey}-rpt-rmv-btn ${getCustomClsName(fieldKey, 'rpt-rmv-btn')}`}
                  {...getCustomAttributes(fieldKey, 'rpt-rmv-btn')}
                  // eslint-disable-next-line react/button-has-type
                  type="button"
                >
                  {fieldData.removeBtnPreIcn && (
                    <img
                      data-testid={`${fieldKey}-rpt-rmv-btn-pre-i`}
                      data-dev-rpt-rmv-btn-pre-i={fieldKey}
                      className={`${fieldKey}-rpt-rmv-btn-pre-i ${getCustomClsName(fieldKey, 'rpt-rmv-btn-pre-i')}`}
                      src={`${fieldData.removeBtnPreIcn}`}
                      alt=""
                      {...getCustomAttributes(fieldKey, 'rpt-rmv-btn-pre-i')}
                    />
                  )}
                  <RenderHtml html={fieldData.removeBtn.txt || ''} />
                  {fieldData.removeBtnSufIcn && (
                    <img
                      data-testid={`${fieldKey}-rpt-rmv-btn-suf-i`}
                      data-dev-rpt-rmv-btn-suf-i={fieldKey}
                      className={`${fieldKey}-rpt-rmv-btn-suf-i ${getCustomClsName(fieldKey, 'rpt-rmv-btn-suf-i')}`}
                      src={fieldData.removeBtnSufIcn}
                      alt=""
                      {...getCustomAttributes(fieldKey, 'rpt-btn-btn-suf-i')}
                    />
                  )}
                </button>
              </div>
            </div>
            {
              fieldData.addToEndBtn.show && (
                <div
                  data-testid={`${fieldKey}-add-to-end-btn-wrp`}
                  data-dev-add-to-end-btn-wrp={fieldKey}
                  className={`${fieldKey}-add-to-end-btn-wrp ${getCustomClsName(fieldKey, 'add-to-end-btn-wrp')}`}
                  {...getCustomAttributes(fieldKey, 'add-to-end-btn-wrp')}
                >
                  <button
                    data-testid={fieldKey}
                    data-dev-add-to-end-btn={fieldKey}
                    className={`${fieldKey}-add-to-end-btn ${getCustomClsName(fieldKey, 'add-to-end-btn')}`}
                    {...getCustomAttributes(fieldKey, 'add-to-end-btn')}
                    // eslint-disable-next-line react/button-has-type
                    type="button"
                  >
                    {fieldData.addToEndBtnPreIcn && (
                      <img
                        data-testid={`${fieldKey}-add-to-end-btn-pre-i`}
                        data-dev-add-to-end-btn-pre-i={fieldKey}
                        className={`${fieldKey}-add-to-end-btn-pre-i ${getCustomClsName(fieldKey, 'add-to-end-btn-pre-i')}`}
                        src={fieldData.addToEndBtnPreIcn}
                        alt=""
                        {...getCustomAttributes(fieldKey, 'add-to-end-btn-pre-i')}
                      />
                    )}
                    <RenderHtml html={fieldData.addToEndBtn.txt || ''} />
                    {fieldData.addToEndBtnSufIcn && (
                      <img
                        data-testid={`${fieldKey}-add-to-end-btn-suf-i`}
                        data-dev-add-to-end-btn-suf-i={fieldKey}
                        className={`${fieldKey}-add-to-end-btn-suf-i ${getCustomClsName(fieldKey, 'add-to-end-btn-suf-i')}`}
                        src={fieldData.addToEndBtnSufIcn}
                        alt=""
                        {...getCustomAttributes(fieldKey, 'add-to-end-btn-suf-i')}
                      />
                    )}
                  </button>
                </div>
              )
            }
          </div>
        </div>
      </InputWrapper>
    </>
  )
}

export default memo(RepeaterField)

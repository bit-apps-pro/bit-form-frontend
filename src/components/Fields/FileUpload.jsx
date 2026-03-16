/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import BitFileUpField from 'bit-file-up-field/src/bit-file-up-field'
import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'
import { $bits, $fields, $flags } from '../../GlobalStates/GlobalStates'
import { getCustomAttributes, getCustomClsName, getDataDevAttrArr, selectInGrid } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

export default function FileUpload({ fieldKey, formID, styleClasses }) {
  const fileUploadWrapElmRef = useRef(null)
  const fileUploadFieldRef = useRef(null)
  const fields = useAtomValue($fields)
  const fieldData = fields[fieldKey]
  const bits = useAtomValue($bits)
  const flags = useAtomValue($flags)
  const { styleMode } = flags

  useEffect(() => {
    if (!fileUploadWrapElmRef?.current) {
      fileUploadWrapElmRef.current = selectInGrid(`.${fieldKey}-file-up-wrpr`)
    }
    const fldConstructor = fileUploadFieldRef.current
    const fldElm = fileUploadWrapElmRef.current
    if (fldConstructor && fldElm && 'destroy' in fldConstructor) {
      fldConstructor.destroy()
    }

    const {
      multiple, allowMaxSize, showMaxSize, maxSizeLabel, maxSize, sizeUnit, isItTotalMax, showSelectStatus, fileSelectStatus, allowedFileType, showFileList, fileExistMsg, showFilePreview, showFileSize, duplicateAllow, accept, minFile, maxFile,
    } = fieldData.config

    const configOptions = {
      fieldKey,
      multiple,
      allowMaxSize,
      maxSizeErrMsg: fieldData?.err?.maxSize?.msg || fieldData?.err?.maxSize?.dflt,
      showMaxSize,
      maxSizeLabel,
      maxSize,
      sizeUnit,
      isItTotalMax,
      showSelectStatus,
      fileSelectStatus,
      allowedFileType,
      showFileList,
      fileExistMsg,
      showFilePreview,
      showFileSize,
      duplicateAllow,
      accept,
      minFile,
      minFileErrMsg: fieldData?.err?.minFile?.msg || fieldData?.err?.minFile?.dflt,
      maxFile,
      maxFileErrMsg: fieldData?.err?.maxFile?.msg || fieldData?.err?.maxFile?.dflt,
      assetsURL: `${bits.assetsURL}/../static/file-upload/`,
      document: document.getElementById('bit-grid-layout')?.contentDocument,
      window: document.getElementById('bit-grid-layout')?.contentWindow,
      attributes: {
        'files-list': getDataDevAttrArr(fieldKey, 'files-list'),
        'file-wrpr': getDataDevAttrArr(fieldKey, 'file-wrpr'),
        'file-preview': getDataDevAttrArr(fieldKey, 'file-preview'),
        'file-title': getDataDevAttrArr(fieldKey, 'file-title'),
        'file-size': getDataDevAttrArr(fieldKey, 'file-size'),
        'cross-btn': getDataDevAttrArr(fieldKey, 'cross-btn'),
      },
      classNames: {
        'files-list': getCustomClsName(fieldKey, 'files-list'),
        'file-wrpr': getCustomClsName(fieldKey, 'file-wrpr'),
        'file-preview': getCustomClsName(fieldKey, 'file-preview'),
        'file-title': getCustomClsName(fieldKey, 'file-title'),
        'file-size': getCustomClsName(fieldKey, 'file-size'),
        'cross-btn': getCustomClsName(fieldKey, 'cross-btn'),
      },
    }

    fileUploadFieldRef.current = new BitFileUpField(fldElm, configOptions)
  }, [fieldData])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        fieldKey={fieldKey}
        fieldData={fieldData}
      >
        <div className={`${fieldKey}-file-up-container ${getCustomClsName(fieldKey, 'file-up-container')}`}>
          <div
            data-dev-file-up-wrpr={fieldKey}
            className={`${fieldKey}-file-up-wrpr ${fieldData.valid.disabled ? 'disabled' : ''} ${fieldData.valid.readonly ? 'readonly' : ''} ${getCustomClsName(fieldKey, 'file-up-wrpr')}`}
            ref={fileUploadWrapElmRef}
            {...getCustomAttributes(fieldKey, 'file-up-wrpr')}
          >
            <div
              data-dev-file-input-wrpr={fieldKey}
              data-inp-wrp
              className={`${fieldKey}-file-input-wrpr ${getCustomClsName(fieldKey, 'file-input-wrpr')}`}
              {...getCustomAttributes(fieldKey, 'file-input-wrpr')}
            >
              <div
                data-dev-btn-wrpr={fieldKey}
                className={`${fieldKey}-btn-wrpr ${getCustomClsName(fieldKey, 'btn-wrpr')}`}
                {...getCustomAttributes(fieldKey, 'btn-wrpr')}
              >
                <button
                  data-testid={`${fieldKey}-inp-btn`}
                  data-dev-inp-btn={fieldKey}
                  type="button"
                  className={`${fieldKey}-inp-btn ${getCustomClsName(fieldKey, 'inp-btn')}`}
                  {...getCustomAttributes(fieldKey, 'inp-btn')}
                >
                  {fieldData.prefixIcn && (
                    <img
                      data-dev-pre-i={fieldKey}
                      className={`${fieldKey}-pre-i ${getCustomClsName(fieldKey, 'pre-i')}`}
                      src={`${fieldData.prefixIcn}`}
                      alt="Upload icon"
                      srcSet=""
                      {...getCustomAttributes(fieldKey, 'pre-i')}
                    />
                  )}
                  <span
                    data-dev-btn-txt={fieldKey}
                    className={`${fieldKey}-btn-txt ${getCustomClsName(fieldKey, 'btn-txt')}`}
                    {...getCustomAttributes(fieldKey, 'btn-txt')}
                  >
                    {fieldData.btnTxt}
                  </span>
                  {fieldData.suffixIcn && (
                    <img
                      data-dev-suf-i={fieldKey}
                      className={`${fieldKey}-suf-i ${getCustomClsName(fieldKey, 'suf-i')}`}
                      src={`${fieldData.suffixIcn}`}
                      alt="Upload icon"
                      srcSet=""
                      {...getCustomAttributes(fieldKey, 'suf-i')}
                    />
                  )}
                </button>
                {fieldData.config.showSelectStatus && (
                  <div
                    data-dev-file-select-status={fieldKey}
                    className={`${fieldKey}-file-select-status ${getCustomClsName(fieldKey, 'file-select-status')}`}
                    {...getCustomAttributes(fieldKey, 'file-select-status')}
                  >
                    No Choosen File
                  </div>
                )}
                {fieldData.config.allowMaxSize && fieldData.config.showMaxSize && fieldData.config.maxSize !== 0 && (
                  <small
                    data-dev-max-size-lbl={fieldKey}
                    className={`${fieldKey}-max-size-lbl ${getCustomClsName(fieldKey, 'max-size-lbl')}`}
                    {...getCustomAttributes(fieldKey, 'max-size-lbl')}
                  >
                    {fieldData.config.maxSizeLabel || `(Max ${fieldData.config.maxSize}${fieldData.config.sizeUnit})`}
                  </small>
                )}
                <input
                  data-testid={`${fieldKey}-fil-upld-inp`}
                  type="file"
                  className={`${fieldKey}-file-upload-input ${getCustomClsName(fieldKey, 'file-upload-input')}`}
                  {...styleMode && { id: fieldKey }}
                  name="file-upload"
                  {...'req' in fieldData.valid && { required: fieldData.valid.req }}
                  {...'disabled' in fieldData.valid && { disabled: fieldData.valid.disabled }}
                  {...'readonly' in fieldData.valid && { readOnly: fieldData.valid.readonly }}
                  {...getCustomAttributes(fieldKey, 'file-upload-input')}
                  aria-disabled
                  tabIndex={-1}
                />
              </div>
              <div className={`err-wrp ${getCustomClsName(fieldKey, 'err-wrp')}`} {...getCustomAttributes(fieldKey, 'err-wrp')} />
            </div>
          </div>
        </div>
      </InputWrapper>
    </>

  )
}

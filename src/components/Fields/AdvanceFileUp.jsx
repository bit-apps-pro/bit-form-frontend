/* eslint-disable import/no-duplicates */
/* eslint-disable func-names */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
import BitAdvanceFileUploadField from 'bit-advanced-file-up-field/src/bit-advanced-file-up-field'
import bitFilepondPluginFileValidateSize from 'bit-filepond-plugin-file-validate-size/src/bit-filepond-plugin-file-validate-size'
import bitFilepondPluginFileValidateType from 'bit-filepond-plugin-file-validate-type/src/bit-filepond-plugin-file-validate-type'
import bitFilepondPluginImageCrop from 'bit-filepond-plugin-image-crop/src/bit-filepond-plugin-image-crop'
import bitFilepondPluginImagePreview from 'bit-filepond-plugin-image-preview/src/bit-filepond-plugin-image-preview'
import bitFilepondPluginImageResize from 'bit-filepond-plugin-image-resize/src/bit-filepond-plugin-image-resize'
import bitFilepondPluginImageTransform from 'bit-filepond-plugin-image-transform/src/bit-filepond-plugin-image-transform'
import bitFilepondPluginImageValidateSize from 'bit-filepond-plugin-image-validate-size/src/bit-filepond-plugin-image-validate-size'
import bitFilepondPluginMediaPreview from 'bit-filepond-plugin-media-preview/src/bit-filepond-plugin-media-preview'
import bitFilePond from 'bit-filepond/src/bit-filepond'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import 'filepond/dist/filepond.min.css'
import { useAtom, useAtomValue } from 'jotai'
import { memo, useEffect, useRef, useState } from 'react'
import { $fields, $flags } from '../../GlobalStates/GlobalStates'
import { selectAllInGrid, selectInGrid } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

function AdvanceFileUp({ attr, formID, fieldKey, styleClasses }) {
  const [fields] = useAtom($fields)
  const fieldData = fields[fieldKey]
  const { config } = fieldData
  const [fileChange, setFileChange] = useState(0)

  const advanceFileFieldRef = useRef(null)
  const container = useRef(null)
  const flags = useAtomValue($flags)
  const { styleMode } = flags

  useEffect(() => {
    const iFrameWindow = document.getElementById('bit-grid-layout').contentWindow
    if (!iFrameWindow.bit_filepond) iFrameWindow.bit_filepond = bitFilePond

    if (!iFrameWindow.bit_filepond_plugin_image_preview) {
      iFrameWindow.bit_filepond_plugin_image_preview = bitFilepondPluginImagePreview
    }
    if (!iFrameWindow.bit_filepond_plugin_file_validate_size) {
      iFrameWindow.bit_filepond_plugin_file_validate_size = bitFilepondPluginFileValidateSize
    }
    if (!iFrameWindow.bit_filepond_plugin_file_validate_type) {
      iFrameWindow.bit_filepond_plugin_file_validate_type = bitFilepondPluginFileValidateType
    }
    if (!iFrameWindow.bit_filepond_plugin_image_crop) {
      iFrameWindow.bit_filepond_plugin_image_crop = bitFilepondPluginImageCrop
    }
    if (!iFrameWindow.bit_filepond_plugin_image_resize) {
      iFrameWindow.bit_filepond_plugin_image_resize = bitFilepondPluginImageResize
    }
    if (!iFrameWindow.bit_filepond_plugin_image_transform) {
      iFrameWindow.bit_filepond_plugin_image_transform = bitFilepondPluginImageTransform
    }
    if (!iFrameWindow.bit_filepond_plugin_image_validate_size) {
      iFrameWindow.bit_filepond_plugin_image_validate_size = bitFilepondPluginImageValidateSize
    }
    if (!iFrameWindow.bit_filepond_plugin_media_preview) {
      iFrameWindow.bit_filepond_plugin_media_preview = bitFilepondPluginMediaPreview
    }

    const configuration = {
      configSetting: config,
      fieldKey,
      window: iFrameWindow,
      document: document.getElementById('bit-grid-layout').contentDocument,
      formID,
      ajaxURL: typeof bits === 'undefined' ? bitFromsFront?.ajaxURL : bits.ajaxURL,
      nonce: typeof bits === 'undefined' ? '' : bits.nonce,
      uploadFileToServer: true,
      onFileUpdate: () => setFileChange(pre => pre + 1),
    }

    if (!container?.current) {
      container.current = selectInGrid(`#filepond-${fieldKey}-container`)
    }
    const fldConstructor = advanceFileFieldRef.current
    const fldElm = container.current
    if (fldConstructor) {
      bitFilePond.destroy(container.current)
      if (fldElm.firstChild) fldElm.removeChild(fldElm.firstChild)
    }
    advanceFileFieldRef.current = new BitAdvanceFileUploadField(fldElm, configuration)
    setFileChange(prv => prv + 1)
  }, [fieldData?.config])

  const addAttrAndClass = (selector, isMultiple = false) => {
    selectInGrid(`.${fieldKey}-inp-wrp .${selector}`)?.setAttribute(`data-dev-${selector}`, fieldKey)
    if (isMultiple) {
      const btnList = selectAllInGrid(`.${fieldKey}-inp-wrp .${selector}`)
      btnList.length > 0 && [...btnList].map(btn => {
        btn.setAttribute(`data-dev-${selector}`, fieldKey)
      })
    }
  }

  useEffect(() => {
    addAttrAndClass('filepond--root')
    addAttrAndClass('filepond--drop-label')
    addAttrAndClass('filepond--label-action')
    addAttrAndClass('filepond--panel-root')
    addAttrAndClass('filepond--item-panel', true)
    addAttrAndClass('filepond--file-action-button', true)
    addAttrAndClass('filepond--drip-blob')
    addAttrAndClass('filepond--file')
  }, [fileChange])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        fieldKey={fieldKey}
        fieldData={attr}
      >
        <input
          hidden
          {...styleMode && { id: fieldKey }}
          type="file"
          className="filepond"
          name="filepond"
          {...'disabled' in fieldData.valid && { disabled: fieldData.valid.disabled }}
          {...'readonly' in fieldData.valid && { readOnly: fieldData.valid.readonly }}
        />
        <div ref={container} id={`filepond-${fieldKey}-container`} className={`filepond-${fieldKey}-container ${fieldData.valid.disabled ? 'disabled' : ''} ${fieldData.valid.readonly ? 'readonly' : ''}`} />
      </InputWrapper>
    </>
  )
}
export default memo(AdvanceFileUp)

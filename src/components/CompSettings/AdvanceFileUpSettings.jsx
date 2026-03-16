/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { create } from 'mutative'
import { memo, useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { useAtom, useSetAtom } from 'jotai'
import { $builderHookStates, $fields, $layouts } from '../../GlobalStates/GlobalStates'
import EditIcn from '../../Icons/EditIcn'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights } from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import { fileFormats } from '../../Utils/StaticData/fileformat'
import Cooltip from '../Utilities/Cooltip'
import DropDown from '../Utilities/DropDown'
import Select from '../Utilities/Select'
import SingleToggle from '../Utilities/SingleToggle'
import FileLblPropertyMdl from './advfileupcmpt/FileLblPropertyMdl'
import FileStyle from './advfileupcmpt/FileStyle'
import FileTypeSize from './advfileupcmpt/FileTypeSize'
import ImageValidateoMdl from './advfileupcmpt/ImageValidateoMdl'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import FieldDisabledSettings from './CompSettingsUtils/FieldDisabledSettings'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'
import FieldReadOnlySettings from './CompSettingsUtils/FieldReadOnlySettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import HelperTxtSettings from './CompSettingsUtils/HelperTxtSettings'
import RequiredSettings from './CompSettingsUtils/RequiredSettings'
import SubTitleSettings from './CompSettingsUtils/SubTitleSettings'
import SimpleAccordion from './StyleCustomize/ChildComp/SimpleAccordion'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

function AdvanceFileUpSettings() {
  const [lblPropertyMdl, setLblPropertyMdl] = useState(false)
  const [imgValdiateMdl, setImgValdiateMdl] = useState(false)
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const { css } = useFela()
  const setLayouts = useSetAtom($layouts)
  const setBuilderHookStates = useSetAtom($builderHookStates)

  const handle = ({ target: { checked, name } }) => {
    if (checked) {
      fieldData.config[name] = true
    } else {
      fieldData.config[name] = false
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${name} ${checked ? 'on' : 'off'} : ${fieldData.lbl || fldKey}`, type: name, state: { fldKey, fields: allFields } })
  }

  const setConfigProp = e => {
    const { value, name, type } = e.target
    if (value && type === 'number') {
      fieldData.config[name] = Number(value)
    } else if (value && type !== 'number') {
      fieldData.config[name] = value

      if (name === 'stylePanelLayout' && value === 'circle') {
        setLayouts(prevLayouts => create(prevLayouts, draftLayouts => {
          const fldLayoutsLg = draftLayouts.lg.findIndex(itm => itm.i === fldKey)

          draftLayouts.lg[fldLayoutsLg].w = 20
        }))
        setBuilderHookStates(prv => ({ ...prv, reRenderGridLayoutByRootLay: prv.reRenderGridLayoutByRootLay + 1 }))
        setTimeout(() => reCalculateFldHeights(fldKey), 100)
      }
    } else {
      delete fieldData.config[name]
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${name} value changed to ${value} : ${fieldData.lbl || fldKey}`, type: name, state: { fldKey, fields: allFields } })
  }

  function setFileFilter(value, typ) {
    const val = value.map(itm => itm.value)
    const mimeType = value?.map(itm => (itm.mimeType ? itm.mimeType : itm.value))

    if (!Array.isArray(fieldData.config[typ])) {
      fieldData.config[typ] = []
    }

    fieldData.config[typ] = (mimeType.length === 1 && typeof mimeType[0]) === 'undefined' ? val : mimeType.flat()

    fieldData.config.fileTypesAll = val
    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Modify Accepted File Type : ${fieldData.lbl || fldKey}`, type: typ, state: { fldKey, fields: allFields } })
  }

  const enablePlugin = (e, typ) => {
    const { checked } = e.target
    if (checked) {
      fieldData.config[typ] = true
    } else {
      fieldData.config[typ] = false
    }

    if (checked && typ === 'allowImageCrop' || typ === 'allowImageResize') {
      fieldData.config.allowImageTransform = true
      fieldData.config.imageResizeMode = 'cover'
    }

    if (fieldData?.config?.allowImageCrop || fieldData?.config?.allowImageResize) {
      fieldData.config.allowImageTransform = true
    }

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `${typ} Plugin ${checked ? 'on' : 'off'} : ${fieldData.lbl || fldKey}`, type: typ, state: { fldKey, fields: allFields } })
  }

  return (
    <div className="">
      <FieldSettingTitle title="Field Settings" subtitle={fieldData.typ} fieldKey={fldKey} />

      <FieldLabelSettings />

      <FieldSettingsDivider />

      <SubTitleSettings />

      <FieldSettingsDivider />

      <AdminLabelSettings />

      <FieldSettingsDivider />

      <SizeAndPosition />

      <FieldSettingsDivider />

      <SimpleAccordion
        id="cptr-stng"
        title={__('Capture')}
        className={css(FieldStyle.fieldSection)}
        open
        tip="The capture option will only work on mobile devices."
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css({ mx: 5 })}>

          <select data-testid="cptr-stng-slct" className={css(FieldStyle.input, ut.mt2)} name="captureMethod" onChange={setConfigProp}>
            <option value="">Select</option>
            <option value="null">Off</option>
            <option value="capture">On</option>
            <option value="user">User Camera</option>
            <option value="environment">Environment Camera</option>
          </select>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />
      <SimpleAccordion
        id="fil-styl-stng"
        title="File Style"
        className={css(FieldStyle.fieldSection)}
      >
        <FileStyle action={setConfigProp} value={fieldData?.config} />
      </SimpleAccordion>
      <FieldSettingsDivider />
      <SimpleAccordion
        id="basic-stng"
        title={__('Basic')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(ut.p2)}>
          <div className={css(ut.flxcb, FieldStyle.labelTip)}>
            <div className={css(ut.flxcb)}>
              <div className={css(ut.fw500)}>{__('Multiple file upload')}</div>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  Enable or disable adding multiple files
                  <br />
                </div>
              </Cooltip>
            </div>
            <SingleToggle
              id="bsc-stng-mltpl-fil-upld"
              className={css(ut.mr4)}
              isChecked={fieldData?.config?.allowMultiple}
              name="allowMultiple"
              action={handle}
            />
          </div>

          <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxb)}>
              <div className={css(ut.fw500)}>{__('Allow File Browse')}</div>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  Enable or disable file browser
                  <br />
                </div>
              </Cooltip>
            </div>
            <SingleToggle
              id="bsc-stng-alw-fil-brws"
              className={css(ut.mr4)}
              isChecked={fieldData?.config?.allowBrowse}
              name="allowBrowse"
              action={handle}
            />
          </div>
          <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxb)}>
              <div className={css(ut.fw500)}>{__('Drag n Drop')}</div>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  Enable or disable drag n drop
                  <br />
                </div>
              </Cooltip>
            </div>
            <SingleToggle
              id="bsc-stng-drg-n-drp"
              className={css(ut.mr4)}
              isChecked={fieldData?.config?.allowDrop}
              name="allowDrop"
              action={handle}
            />
          </div>
          <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxb)}>
              <div className={css(ut.fw500)}>{__('Allow copy to Pasting of files')}</div>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  Enable or disable pasting of files
                  <br />
                </div>
              </Cooltip>
            </div>
            <SingleToggle
              id="bsc-stng-alw-pst"
              className={css(ut.mr4)}
              isChecked={fieldData?.config?.allowPaste}
              name="allowPaste"
              action={handle}
            />
          </div>
          {/* {!fieldData?.config?.allowMultiple && (
            <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip)}>
              <div className={css(ut.flxb)}>
                <div className={css(ut.fw500)}>{__('File Replace')}</div>
                <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                  <div className={css(ut.tipBody)}>
                    Enable or disable File Replace
                    <br />
                  </div>
                </Cooltip>
              </div>
              <SingleToggle isChecked={fieldData?.config?.allowReplace} name="allowReplace" action={handle} />
            </div>
          )} */}
          <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxb)}>
              <div className={css(ut.fw500)}>{__('Allow reorder files')}</div>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2, FieldStyle.hover_tip)}>
                <div className={css(ut.tipBody)}>
                  Allow users to reorder files with drag and drop interaction
                  <br />
                </div>
              </Cooltip>
            </div>
            <SingleToggle
              id="bsc-stng-alw-reordr-fil"
              className={css(ut.mr4)}
              isChecked={fieldData?.config?.allowReorder}
              name="allowReorder"
              action={handle}
            />
          </div>
          <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxb)}>
              <div className={css(ut.fw500)}>{__('Upload on select')}</div>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  Immediately upload new files to the server
                  <br />
                </div>
              </Cooltip>
            </div>
            <SingleToggle
              id="bsc-stng-upld-on-slct"
              className={css(ut.mr4)}
              isChecked={fieldData?.config?.instantUpload}
              name="instantUpload"
              action={handle}
            />
          </div>
          <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxb)}>
              <div className={css(ut.fw500)}>{__('Full page droppable')}</div>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  dropped on the webpage
                  <br />
                </div>
              </Cooltip>
            </div>
            <SingleToggle
              id="bsc-stng-ful-pag-drpabl"
              className={css(ut.mr4)}
              isChecked={fieldData?.config?.dropOnPage}
              name="dropOnPage"
              action={handle}
            />
          </div>
          <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxb)}>
              <div className={css(ut.fw500)}>{__('Labels Customization')}</div>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  All Label Customization
                  <br />
                </div>
              </Cooltip>
            </div>
            <button
              data-destid="bsc-stng-lbl-cstmztn"
              type="button"
              aria-label="Image Validate Customization "
              className={css(ut.btn, ut.pr4)}
              onClick={() => setLblPropertyMdl(true)}
              onKeyDown={() => setLblPropertyMdl(true)}
            >
              <EditIcn size={21} />
            </button>
            <FileLblPropertyMdl
              title="Placholder / Label / Title edit"
              showMdl={lblPropertyMdl}
              setshowMdl={setLblPropertyMdl}
            />

          </div>
          <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
            <span>Maximum File</span>
            <input
              data-testid="alw-mltpl-max-inp"
              className={css(FieldStyle.input, ut.w3, ut.mt1)}
              type="number"
              name="maxFiles"
              value={fieldData?.config?.maxFiles}
              onChange={setConfigProp}
              placeholder="Maximum number of file"
            />
          </div>
          <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
            <span>Maximum Parallel Upload</span>
            <input
              data-testid="alw-mltpl-max-inp"
              className={css(FieldStyle.input, ut.w3, ut.mt1)}
              type="number"
              name="maxParallelUploads"
              value={fieldData?.config?.maxParallelUploads}
              onChange={setConfigProp}
              placeholder="Maximum number of parallel upload"
            />
          </div>
        </div>

      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="fil-siz-vldtn-stng"
        title={__('File size validation')}
        className={css(FieldStyle.fieldSection)}
        switching
        toggleAction={(e) => enablePlugin(e, 'allowFileSizeValidation')}
        toggleChecked={fieldData?.config?.allowFileSizeValidation}
        open={fieldData?.config?.allowFileSizeValidation}
        disable={!fieldData?.config?.allowFileSizeValidation}
        tip="Note : If you enable this option, the File size validation features will work"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <FileTypeSize action={setConfigProp} />
      </SimpleAccordion>

      <FieldSettingsDivider />
      <SimpleAccordion
        id="fil-typ-vldtn-stng"
        title={__('File type validation')}
        className={css(FieldStyle.fieldSection)}
        switching
        toggleAction={(e) => enablePlugin(e, 'allowFileTypeValidation')}
        toggleChecked={fieldData?.config?.allowFileTypeValidation}
        open={fieldData?.config?.allowFileTypeValidation}
        disable={!fieldData?.config?.allowFileTypeValidation}
        tip="Note : Its features will not work when it is disabled"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css(ut.ml2)}>
          <DropDown
            className={css(ut.mt2, ut.w10, ut.fs12, ut.fw500)}
            disableChip={false}
            customValue={false}
            titleClassName={css(ut.mt2, ut.fw500)}
            title={__('Allowed File Mime Type:')}
            isMultiple
            addable
            options={fileFormats}
            placeholder={__('Select File Type')}
            jsonValue
            action={(e) => setFileFilter(e, 'acceptedFileTypes')}
            value={fieldData?.config?.fileTypesAll || fieldData?.config?.acceptedFileTypes}
          // tip="Select the fill types that will be accepted."
          // tipProps={{ width: 200, icnSize: 17 }}
          />
          <div className={css(FieldStyle.placeholder, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.dyb)}>
              <label className={css(ut.fw500, ut.mr1)}>Invalid File Message Error</label>
              <Cooltip width={250} icnSize={17}>
                <div className={css(ut.tipBody)}>
                  Message shown when an invalid file is added
                </div>
              </Cooltip>
            </div>
            <input
              data-testid="invld-fil-err-msg-inp"
              placeholder="File of Invalid type"
              className={css(FieldStyle.input)}
              type="text"
              name="labelFileTypeNotAllowed"
              value={fieldData?.config?.labelFileTypeNotAllowed}
              onChange={setConfigProp}
            />
          </div>
          <div className={css(FieldStyle.placeholder, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.dyb)}>
              <label className={css(ut.fw500)}>File types Message Error</label>
              <Cooltip width={250} icnSize={17}>
                <div className={css(ut.tipBody)}>
                  Message shown to indicate the allowed file types
                </div>
              </Cooltip>
            </div>
            <input
              data-testid="fil-typ-err-msg-inp"
              placeholder="Expects {allButLastType} or {lastType}"
              className={css(FieldStyle.input)}
              type="text"
              name="fileValidateTypeLabelExpectedTypes"
              value={fieldData?.config?.fileValidateTypeLabelExpectedTypes}
              onChange={setConfigProp}
            />
          </div>
        </div>

      </SimpleAccordion>

      <FieldSettingsDivider />
      <SimpleAccordion
        id="img-prvw-stng"
        title={__('Image Preview')}
        className={css(FieldStyle.fieldSection)}
        switching
        toggleAction={(e) => enablePlugin(e, 'allowImagePreview')}
        toggleChecked={fieldData?.config?.allowImagePreview}
        open={fieldData?.config?.allowImagePreview}
        disable={!fieldData?.config?.allowImagePreview}
        tip="Note : If you enable this option, the Image Preview features will work"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css({ m: 5 })}>

          <div className={css(FieldStyle.placeholder, FieldStyle.labelTip)}>
            <div className={css(ut.dyb)}>
              <label className={css(ut.fw500, ut.w9)}>Image Preview Min Height</label>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  Minimum image preview height
                </div>
              </Cooltip>
            </div>
            <input
              data-testid="img-prvw-min-hight-inp"
              placeholder="44"
              className={css(FieldStyle.input)}
              type="number"
              name="imagePreviewMinHeight"
              value={fieldData?.config?.imagePreviewMinHeight}
              min="0"
              place
              onChange={setConfigProp}
            />
          </div>
          <div className={css(FieldStyle.placeholder, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.dyb)}>
              <label className={css(ut.fw500, ut.w9)}>Image Preview Max Height</label>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  Maximum image preview height
                </div>
              </Cooltip>
            </div>
            <input
              data-testid="img-prvw-max-hight-inp"
              placeholder="256"
              className={css(FieldStyle.input)}
              type="number"
              name="imagePreviewMaxHeight"
              value={fieldData?.config?.imagePreviewMaxHeight || ''}
              min="0"
              onChange={setConfigProp}
            />
          </div>
          <div className={css(FieldStyle.placeholder, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.dyb)}>
              <label className={css(ut.fw500, ut.w9)}>Preview Height</label>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  Fixed image preview height, overrides min and max preview height
                </div>
              </Cooltip>
            </div>
            <input
              data-testid="img-prvw-hight-inp"
              placeholder="Preview Height"
              className={css(FieldStyle.input)}
              type="number"
              name="imagePreviewHeight"
              value={fieldData?.config?.imagePreviewHeight || ''}
              min="0"
              onChange={setConfigProp}
            />
          </div>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <div className={css(ut.flxcb, ut.mt2, FieldStyle.labelTip, FieldStyle.fieldSection)}>
        <div className={css(ut.flxb)}>
          <div>{__('Video/Pdf Preview')}</div>
          <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
            <div className={css(ut.tipBody)}>
              Enable or disable Video or Pdf preview mode
              <br />
            </div>
          </Cooltip>
        </div>
        <SingleToggle
          id="pdf-prvw-stng"
          className={css(ut.mr30)}
          isChecked={fieldData?.config?.allowPreview || ''}
          name="allowPreview"
          action={(e) => enablePlugin(e, 'allowPreview')}
        />
      </div>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="img-crp-stng"
        title={__('Image Crop')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        toggleAction={(e) => enablePlugin(e, 'allowImageCrop')}
        toggleChecked={fieldData?.config?.allowImageCrop}
        open={fieldData?.config?.allowImageCrop}
        disable={!fieldData?.config?.allowImageCrop}
        tip="Note : If you enable this option, the Image Crop features will work"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css({ m: 5 }, FieldStyle.labelTip)}>
          <div className={css(ut.dyb)}>
            <label className={css(ut.fw500, ut.ml1)}>Crop Aspect Ratio</label>
            <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
              <div className={css(ut.tipBody)}>
                The aspect ratio of the crop in human readable format, for example '1:1' or '16:10'
              </div>
            </Cooltip>
          </div>
          <div className={css(FieldStyle.placeholder)}>
            <input
              data-testid="img-spct-rato-inp"
              placeholder="for example '1:1' or '16:10'"
              className={css(FieldStyle.input)}
              type="text"
              name="imageCropAspectRatio"
              value={fieldData?.config?.imageCropAspectRatio}
              onChange={setConfigProp}
            />
          </div>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="img-resiz-stng"
        title={__('Image Resize')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        toggleAction={(e) => enablePlugin(e, 'allowImageResize')}
        toggleChecked={fieldData?.config?.allowImageResize}
        open={fieldData?.config?.allowImageResize}
        disable={!fieldData?.config?.allowImageResize}
        tip="Note :If you enable this option, the Image Resize features will work"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css({ m: 5 })}>
          <div className={css(FieldStyle.placeholder, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.dyb)}>
              <label className={css(ut.fw500)}>Image Resize Width</label>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  The output width in pixels, if null will use value of imageResizeTargetHeight
                </div>
              </Cooltip>
            </div>
            <input
              data-testid="img-resiz-wdt-inp"
              placeholder="Image Resize Width"
              className={css(FieldStyle.input)}
              type="number"
              name="imageResizeTargetWidth"
              value={fieldData?.config?.imageResizeTargetWidth}
              min="0"
              onChange={setConfigProp}
            />
          </div>
          <div className={css(FieldStyle.placeholder, ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.dyb)}>
              <label className={css(ut.fw500)}>Image Resize Height</label>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  The output height in pixels, if null will use value of imageResizeTargetWidth
                </div>
              </Cooltip>
            </div>
            <input
              data-testid="img-resiz-hight-inp"
              placeholder="Image Resize Height"
              className={css(FieldStyle.input)}
              type="number"
              name="imageResizeTargetHeight"
              value={fieldData?.config?.imageResizeTargetHeight}
              min="0"
              onChange={setConfigProp}
            />
          </div>
          <div className={css(ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.dyb, ut.mb2)}>
              <label className={css(ut.fw500, ut.ml1)}>Image Resize Mode</label>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  The method in which the images are resized.
                </div>
              </Cooltip>
            </div>
            <select
              data-testid="img-resiz-mod-slct"
              className={css(FieldStyle.selectBox, ut.mr2, ut.ml1, ut.fw500)}
              name="imageResizeMode"
              onChange={setConfigProp}
              value={fieldData.config.imageResizeMode}
            >
              <option value="">Select</option>
              <option value="cover">Cover</option>
              <option value="force">Force</option>
              <option value="contain">Contain</option>
            </select>
          </div>
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="img-trnsfrm"
        title={__('Image Transform')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        toggleAction={(e) => enablePlugin(e, 'allowImageTransform')}
        toggleChecked={fieldData?.config?.allowImageTransform}
        open={fieldData?.config?.allowImageTransform}
        disable={!fieldData?.config?.allowImageTransform}
        tip="Note : If you enable this option, the Image Transform features will work"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css(ut.mt2, ut.ml2)}>
          <div className={css(ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxc)}>
              <label className={css(ut.fw500)}>Image Output Type</label>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  The file type of the output image. Can be either 'image/jpeg' or 'image/png' as those are the formats.
                </div>
              </Cooltip>
            </div>
            <Select
              dataTestId="img-outpt-typ-slct"
              color="primary"
              inputName="imageTransformOutputMimeType"
              value={fieldData.config.imageTransformOutputMimeType || ''}
              onChange={(value, e) => setConfigProp(e)}
              options={[
                { label: 'Select', value: '' },
                { label: 'Image/jpeg', value: 'image/jpeg' },
                { label: 'Image/png', value: 'image/png' },
              ]}
              w="99%"
              className={css({ fs: 14 }, ut.mt2)}
            />
          </div>
          <div className={css(ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxc)}>
              <label className={css(ut.fw500)}>Transform Output Quality</label>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  The quality of the output image supplied as a value between 0 and 100.
                </div>
              </Cooltip>
            </div>
            <input
              data-testid="trnsfrm-outpt-qlty-inp"
              placeholder="94"
              className={css(FieldStyle.input)}
              type="number"
              name="imageTransformOutputQuality"
              value={fieldData?.config?.imageTransformOutputQuality}
              min="0"
              onChange={setConfigProp}
            />
          </div>
          {/* <div className={css(ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxb)}>
              <label className={css(ut.fw500)}>Transform Output Quality Mode</label>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  Should output quality be enforced, set the 'optional' to only apply when a transform is required due to other requirements (e.g. resize or crop)
                </div>
              </Cooltip>
            </div>
            <select className={css(FieldStyle.input, ut.fw500)} name="imageTransformOutputQualityMode" onChange={setErrorMsg}>
              <option value="">Select</option>
              <option value="resize">Resize</option>
              <option value="crop">Crop</option>
            </select>
          </div> */}
          <div className={css(ut.mt2, FieldStyle.labelTip)}>
            <div className={css(ut.flxcb)}>
              <label className={css(ut.fw500, ut.ml1, ut.mt1)}>Client Transforms</label>
              <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
                <div className={css(ut.tipBody)}>
                  Client Transform
                </div>
              </Cooltip>

              <Select
                dataTestId="clnt-trnsfrm-slct"
                color="primary"
                inputName="imageTransformClientTransforms"
                value={fieldData.config.imageTransformClientTransforms || ''}
                onChange={(value, e) => setConfigProp(e)}
                options={[
                  { label: 'Select', value: '' },
                  { label: 'Resize', value: 'resize' },
                  { label: 'Crop', value: 'crop' },
                ]}
                w="30%"
                className={css({ fs: 14 }, ut.mt2)}
              />
            </div>

          </div>
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      <SimpleAccordion
        id="img-vldtn-siz"
        title={__('Image validate size')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        toggleAction={(e) => enablePlugin(e, 'allowImageValidateSize')}
        toggleChecked={fieldData?.config?.allowImageValidateSize}
        open={fieldData?.config?.allowImageValidateSize}
        disable={!fieldData?.config?.allowImageValidateSize}
        tip="Validate images when user upload image, customize configuration to set different validation on images."
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css(ut.flxc, ut.mt2)}>
          <div className={css(ut.fw500, ut.w8)}>{__('Edit Options')}</div>
          <button
            data-testid="img-vldtn-cstmztn-btn"
            type="button"
            aria-label="Image Validate Customization "
            className={css(ut.btn)}
            onClick={() => setImgValdiateMdl(true)}
            onKeyDown={() => setImgValdiateMdl(true)}
          >
            <EditIcn size={21} />
          </button>
          <ImageValidateoMdl
            title="Image Validate Customization "
            showMdl={imgValdiateMdl}
            setshowMdl={setImgValdiateMdl}
          />
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <RequiredSettings />

      <FieldSettingsDivider />

      <HelperTxtSettings />

      <FieldSettingsDivider />

      <FieldReadOnlySettings />

      <FieldSettingsDivider />

      <FieldDisabledSettings />

      <FieldSettingsDivider />

      <FieldHideSettings cls={css(FieldStyle.fieldSection, FieldStyle.singleOption)} />

      <FieldSettingsDivider />

    </div>
  )
}

export default memo(AdvanceFileUpSettings)

/* eslint-disable no-param-reassign */
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $builderHookStates, $fields, $layouts } from '../../../../../GlobalStates/GlobalStates'
import EditIcn from '../../../../../Icons/EditIcn'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import FileStyle from '../../../../CompSettings/advfileupcmpt/FileStyle'
import FileTypeSize from '../../../../CompSettings/advfileupcmpt/FileTypeSize'
import ImageValidateoMdl from '../../../../CompSettings/advfileupcmpt/ImageValidateoMdl'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import Cooltip from '../../../../Utilities/Cooltip'
import Select from '../../../../Utilities/Select'
import SingleToggle from '../../../../Utilities/SingleToggle'

interface AdvancedFileUpAdvancedSettingsProps {
  /**
   * Additional CSS class names to apply to the container
   */
  className?: string
}

export default function AdvancedFileUpAdvancedSettings({
  className = ''
}: AdvancedFileUpAdvancedSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const setLayouts = useSetAtom($layouts)
  const setBuilderHookStates = useSetAtom($builderHookStates)
  const { css } = useFela()

  const [imgValidateMdl, setImgValidateMdl] = useState(false)

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const config = fieldData?.config || {}

  // Handler for configuration properties
  const handleConfigProp = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { value, name, type } = e.target

    const updatedFields = create(fields, draft => {
      const fieldConfig = draft[fldKey].config

      if (value && type === 'number') {
        fieldConfig[name] = Number(value)
      } else if (value && type !== 'number') {
        fieldConfig[name] = value

        // Special handling for stylePanelLayout circle
        if (name === 'stylePanelLayout' && value === 'circle') {
          setLayouts(prevLayouts => create(prevLayouts, draftLayouts => {
            const fldLayoutsLg = draftLayouts.lg.findIndex(itm => itm.i === fldKey)
            if (fldLayoutsLg !== -1) {
              draftLayouts.lg[fldLayoutsLg].w = 20
            }
          }))
          setBuilderHookStates(prv => ({
            ...prv,
            reRenderGridLayoutByRootLay: prv.reRenderGridLayoutByRootLay + 1
          }))
          setTimeout(() => reCalculateFldHeights(fldKey), 100)
        }
      } else {
        delete fieldConfig[name]
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${name} value changed to ${value} : ${fieldData.lbl || fldKey}`,
      type: name,
      state: { fldKey, fields: updatedFields }
    })
  }

  // Handler for enabling/disabling plugins
  const handleEnablePlugin = (e: React.ChangeEvent<HTMLInputElement>, pluginName: string): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      const fieldConfig = draft[fldKey].config
      fieldConfig[pluginName] = checked

      // Special handling for image crop and resize
      if (checked && (pluginName === 'allowImageCrop' || pluginName === 'allowImageResize')) {
        fieldConfig.allowImageTransform = true
        fieldConfig.imageResizeMode = 'cover'
      }

      // Check if either crop or resize is enabled
      if (fieldConfig.allowImageCrop || fieldConfig.allowImageResize) {
        fieldConfig.allowImageTransform = true
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${pluginName} Plugin ${checked ? 'on' : 'off'} : ${fieldData.lbl || fldKey}`,
      type: pluginName,
      state: { fldKey, fields: updatedFields }
    })
  }

  return (
    <div className={className}>
      {/* Capture Settings */}
      <SimpleAccordion
        id="cptr-stng"
        title={__('Capture')}
        className={css(FieldStyle.fieldSection)}
        open
        tip="The capture option will only work on mobile devices."
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css({ mx: 5 })}>
          <select
            data-testid="cptr-stng-slct"
            className={css(FieldStyle.input, ut.mt2)}
            name="captureMethod"
            onChange={handleConfigProp}
            value={config.captureMethod ?? ''}
          >
            <option value="">Select</option>
            <option value="null">Off</option>
            <option value="capture">On</option>
            <option value="user">User Camera</option>
            <option value="environment">Environment Camera</option>
          </select>
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />
      {/* File Style Settings */}
      <SimpleAccordion
        id="fil-styl-stng"
        title="File Style"
        className={css(FieldStyle.fieldSection)}
      >
        <FileStyle action={handleConfigProp} value={config} />
      </SimpleAccordion>
      <FieldSettingsDivider />
      {/* File Size Validation */}
      <SimpleAccordion
        id="fil-siz-vldtn-stng"
        title={__('File size validation')}
        className={css(FieldStyle.fieldSection)}
        switching
        toggleAction={(e) => handleEnablePlugin(e, 'allowFileSizeValidation')}
        toggleChecked={config.allowFileSizeValidation ?? false}
        open={config.allowFileSizeValidation ?? false}
        disable={!config.allowFileSizeValidation}
        tip="Note : If you enable this option, the File size validation features will work"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <FileTypeSize action={handleConfigProp} />
      </SimpleAccordion>
      <FieldSettingsDivider />
      {/* Image Preview */}
      <SimpleAccordion
        id="img-prvw-stng"
        title={__('Image Preview')}
        className={css(FieldStyle.fieldSection)}
        switching
        toggleAction={(e) => handleEnablePlugin(e, 'allowImagePreview')}
        toggleChecked={config.allowImagePreview ?? false}
        open={config.allowImagePreview ?? false}
        disable={!config.allowImagePreview}
        tip="Note : If you enable this option, the Image Preview features will work"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css({ m: 5 })}>
          {/* Image Preview Min Height */}
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
              value={config.imagePreviewMinHeight ?? ''}
              min="0"
              onChange={handleConfigProp}
            />
          </div>

          {/* Image Preview Max Height */}
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
              value={config.imagePreviewMaxHeight ?? ''}
              min="0"
              onChange={handleConfigProp}
            />
          </div>

          {/* Preview Height */}
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
              value={config.imagePreviewHeight ?? ''}
              min="0"
              onChange={handleConfigProp}
            />
          </div>
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      {/* Video/Pdf Preview */}
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
          isChecked={config.allowPreview ?? false}
          name="allowPreview"
          action={(e) => handleEnablePlugin(e, 'allowPreview')}
        />
      </div>
      <FieldSettingsDivider />

      {/* Image Crop */}
      <SimpleAccordion
        id="img-crp-stng"
        title={__('Image Crop')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        toggleAction={(e) => handleEnablePlugin(e, 'allowImageCrop')}
        toggleChecked={config.allowImageCrop ?? false}
        open={config.allowImageCrop ?? false}
        disable={!config.allowImageCrop}
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
              value={config.imageCropAspectRatio ?? ''}
              onChange={handleConfigProp}
            />
          </div>
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />

      {/* Image Resize */}
      <SimpleAccordion
        id="img-resiz-stng"
        title={__('Image Resize')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        toggleAction={(e) => handleEnablePlugin(e, 'allowImageResize')}
        toggleChecked={config.allowImageResize ?? false}
        open={config.allowImageResize ?? false}
        disable={!config.allowImageResize}
        tip="Note :If you enable this option, the Image Resize features will work"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css({ m: 5 })}>
          {/* Image Resize Width */}
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
              value={config.imageResizeTargetWidth ?? ''}
              min="0"
              onChange={handleConfigProp}
            />
          </div>

          {/* Image Resize Height */}
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
              value={config.imageResizeTargetHeight ?? ''}
              min="0"
              onChange={handleConfigProp}
            />
          </div>

          {/* Image Resize Mode */}
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
              onChange={handleConfigProp}
              value={config.imageResizeMode ?? ''}
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

      {/* Image Transform */}
      <SimpleAccordion
        id="img-trnsfrm"
        title={__('Image Transform')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        toggleAction={(e) => handleEnablePlugin(e, 'allowImageTransform')}
        toggleChecked={config.allowImageTransform ?? false}
        open={config.allowImageTransform ?? false}
        disable={!config.allowImageTransform}
        tip="Note : If you enable this option, the Image Transform features will work"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css(ut.mt2, ut.ml2)}>
          {/* Image Output Type */}
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
              value={config.imageTransformOutputMimeType ?? ''}
              onChange={(value, e) => handleConfigProp(e)}
              options={[
                { label: 'Select', value: '' },
                { label: 'Image/jpeg', value: 'image/jpeg' },
                { label: 'Image/png', value: 'image/png' },
              ]}
              w="99%"
              className={css({ fs: 14 }, ut.mt2)}
            />
          </div>

          {/* Transform Output Quality */}
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
              value={config.imageTransformOutputQuality ?? ''}
              min="0"
              onChange={handleConfigProp}
            />
          </div>

          {/* Client Transforms */}
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
                value={config.imageTransformClientTransforms ?? ''}
                onChange={(value, e) => handleConfigProp(e)}
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

      {/* Image Validate Size */}
      <SimpleAccordion
        id="img-vldtn-siz"
        title={__('Image validate size')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        toggleAction={(e) => handleEnablePlugin(e, 'allowImageValidateSize')}
        toggleChecked={config.allowImageValidateSize ?? false}
        open={config.allowImageValidateSize ?? false}
        disable={!config.allowImageValidateSize}
        tip="Validate images when user upload image, customize configuration to set different validation on images."
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css(ut.flxc, ut.mt2)}>
          <div className={css(ut.fw500, ut.w8)}>{__('Edit Options')}</div>
          <button
            data-testid="img-vldtn-cstmztn-btn"
            type="button"
            aria-label="Image Validate Customization"
            className={css(ut.btn)}
            onClick={() => setImgValidateMdl(true)}
            onKeyDown={() => setImgValidateMdl(true)}
          >
            <EditIcn size={21} />
          </button>
        </div>
      </SimpleAccordion>

      {/* Image Validate Modal */}
      <ImageValidateoMdl
        title="Image Validate Customization"
        showMdl={imgValidateMdl}
        setshowMdl={setImgValidateMdl}
      />
    </div>
  )
}
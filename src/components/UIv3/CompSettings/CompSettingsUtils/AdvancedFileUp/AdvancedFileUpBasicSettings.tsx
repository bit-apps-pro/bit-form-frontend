/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import EditIcn from '../../../../../Icons/EditIcn'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import { fileFormats } from '../../../../../Utils/StaticData/fileformat'
import FileLblPropertyMdl from '../../../../CompSettings/advfileupcmpt/FileLblPropertyMdl'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import Cooltip from '../../../../Utilities/Cooltip'
import DropDown from '../../../../Utilities/DropDown'
import SingleToggle from '../../../../Utilities/SingleToggle'

interface AdvancedFileUpBasicSettingsProps {
  /**
   * Additional CSS class names to apply to the container
   */
  className?: string
}

interface FileFormat {
  label: string
  value: string
  mimeType?: string | string[]
}
export default function AdvancedFileUpBasicSettings({
  className = ''
}: AdvancedFileUpBasicSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  const [lblPropertyMdl, setLblPropertyMdl] = useState(false)

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const config = fieldData?.config || {}

  // Handler for basic toggle settings
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked, name } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config[name] = checked
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${name} ${checked ? 'on' : 'off'} : ${fieldData.lbl || fldKey}`,
      type: name,
      state: { fldKey, fields: updatedFields }
    })
  }

  // Handler for configuration properties
  const handleConfigProp = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name, type } = e.target

    const updatedFields = create(fields, draft => {
      if (value && type === 'number') {
        draft[fldKey].config[name] = Number(value)
      } else if (value && type !== 'number') {
        draft[fldKey].config[name] = value
      } else {
        delete draft[fldKey].config[name]
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${name} value changed to ${value} : ${fieldData.lbl || fldKey}`,
      type: name,
      state: { fldKey, fields: updatedFields }
    })
  }

  // Handler for file type filter
  const handleFileFilter = (value: FileFormat[]): void => {
    const val = value.map(itm => itm.value)
    const mimeType = value?.map(itm => (itm.mimeType ? itm.mimeType : itm.value))

    const updatedFields = create(fields, draft => {
      const fieldConfig = draft[fldKey].config

      if (!Array.isArray(fieldConfig.acceptedFileTypes)) {
        fieldConfig.acceptedFileTypes = []
      }

      fieldConfig.acceptedFileTypes = (mimeType.length === 1 && typeof mimeType[0] === 'undefined')
        ? val
        : mimeType.flat()

      fieldConfig.fileTypesAll = val
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Modify Accepted File Type : ${fieldData.lbl || fldKey}`,
      type: 'acceptedFileTypes',
      state: { fldKey, fields: updatedFields }
    })
  }

  // Handler for enabling/disabling plugins
  const handleEnablePlugin = (e: React.ChangeEvent<HTMLInputElement>, pluginName: string): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      draft[fldKey].config[pluginName] = checked
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
      {/* Basic Settings */}
      <SimpleAccordion
        id="basic-stng"
        title={__('Basic')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(ut.p2)}>
          {/* Multiple file upload */}
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
              isChecked={config.allowMultiple ?? false}
              name="allowMultiple"
              action={handleToggle}
            />
          </div>

          {/* Allow File Browse */}
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
              isChecked={config.allowBrowse ?? false}
              name="allowBrowse"
              action={handleToggle}
            />
          </div>

          {/* Drag n Drop */}
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
              isChecked={config.allowDrop ?? false}
              name="allowDrop"
              action={handleToggle}
            />
          </div>

          {/* Allow Paste */}
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
              isChecked={config.allowPaste ?? false}
              name="allowPaste"
              action={handleToggle}
            />
          </div>

          {/* Allow reorder files */}
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
              isChecked={config.allowReorder ?? false}
              name="allowReorder"
              action={handleToggle}
            />
          </div>

          {/* Upload on select */}
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
              isChecked={config.instantUpload ?? false}
              name="instantUpload"
              action={handleToggle}
            />
          </div>

          {/* Full page droppable */}
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
              isChecked={config.dropOnPage ?? false}
              name="dropOnPage"
              action={handleToggle}
            />
          </div>

          {/* Labels Customization */}
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
              data-testid="bsc-stng-lbl-cstmztn"
              type="button"
              aria-label="Image Validate Customization"
              className={css(ut.btn, ut.pr4)}
              onClick={() => setLblPropertyMdl(true)}
              onKeyDown={() => setLblPropertyMdl(true)}
            >
              <EditIcn size={21} />
            </button>
          </div>

          {/* Maximum File */}
          <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
            <span>Maximum File</span>
            <input
              data-testid="alw-mltpl-max-inp"
              className={css(FieldStyle.input, ut.w3, ut.mt1)}
              type="number"
              name="maxFiles"
              value={config.maxFiles ?? ''}
              onChange={handleConfigProp}
              placeholder="Maximum number of file"
            />
          </div>

          {/* Maximum Parallel Upload */}
          <div className={css(ut.flxc, ut.fw500, FieldStyle.labelTip)}>
            <span>Maximum Parallel Upload</span>
            <input
              data-testid="alw-mltpl-max-prll-inp"
              className={css(FieldStyle.input, ut.w3, ut.mt1)}
              type="number"
              name="maxParallelUploads"
              value={config.maxParallelUploads ?? ''}
              onChange={handleConfigProp}
              placeholder="Maximum number of parallel upload"
            />
          </div>
        </div>
      </SimpleAccordion>
      <FieldSettingsDivider />
      {/* File Type Validation */}
      <SimpleAccordion
        id="fil-typ-vldtn-stng"
        title={__('File type validation')}
        className={css(FieldStyle.fieldSection)}
        switching
        toggleAction={(e) => handleEnablePlugin(e, 'allowFileTypeValidation')}
        toggleChecked={config.allowFileTypeValidation ?? false}
        open={config.allowFileTypeValidation ?? false}
        disable={!config.allowFileTypeValidation}
        tip="Note : Its features will not work when it is disabled"
        tipProps={{ width: 200, icnSize: 17 }}
      >
        <div className={css(ut.ml2)}>
          {/* Allowed File Mime Type */}
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
            action={handleFileFilter}
            value={config.fileTypesAll || config.acceptedFileTypes}
          />

          {/* Invalid File Message Error */}
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
              value={config.labelFileTypeNotAllowed ?? ''}
              onChange={handleConfigProp}
            />
          </div>

          {/* File types Message Error */}
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
              value={config.fileValidateTypeLabelExpectedTypes ?? ''}
              onChange={handleConfigProp}
            />
          </div>
        </div>
      </SimpleAccordion>

      {/* Labels Property Modal */}
      <FileLblPropertyMdl
        title="Placeholder / Label / Title edit"
        showMdl={lblPropertyMdl}
        setshowMdl={setLblPropertyMdl}
      />
    </div>
  )
}
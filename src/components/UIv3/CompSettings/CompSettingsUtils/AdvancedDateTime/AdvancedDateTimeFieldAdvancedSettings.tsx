import 'ace-builds'
// modes
import 'ace-builds/src-min-noconflict/mode-javascript'
// snippets
import 'ace-builds/src-min-noconflict/snippets/javascript'
// themes
import 'ace-builds/src-min-noconflict/theme-twilight'
// extensions
import 'ace-builds/src-min-noconflict/ext-emmet'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import { useAtom } from 'jotai'
import { useState } from 'react'
import AceEditor from 'react-ace'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import AdvancedDateTimeFieldAceModel from '../../../../CompSettings/FieldSettings/AdvancedDateTime/AdvancedDateTimeFieldAceModel'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import RenderHtml from '../../../../Utilities/RenderHtml'

/**
 * Advanced Date Time Field Advanced Settings Component
 * 
 * Provides a code editor (AceEditor) for entering custom flatpickr configurations.
 * Allows power users to access the full flatpickr API with custom JavaScript objects.
 * 
 * Features:
 * - JavaScript code editor with syntax highlighting
 * - Modal for better editing experience
 * - Validation for JavaScript object syntax
 * - Direct access to all flatpickr options
 * - Link to flatpickr documentation
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function AdvancedDateTimeFieldAdvancedSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields] = useAtom($fields)
  const [labelModal, setLabelModal] = useState(false)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])

  return (
    <>
      <SimpleAccordion
        id="advanced-stng"
        title={__('Advanced Configuration')}
        className={css(FieldStyle.fieldSection)}
        open
        isPro
      >
        <div
          role="button"
          tabIndex={-1}
          data-testid="advanced-config-editor"
          className={css(ut.p2)}
          onClick={() => setLabelModal(true)}
          onKeyDown={() => setLabelModal(true)}
        >
          <AceEditor
            placeholder="Write your custom configuration here"
            mode="javascript"
            theme="twilight"
            name="advanced-datetime-config"
            value={fieldData?.config?.advancedConfig || ''}
            fontSize={14}
            lineHeight={19}
            height="200px"
            width="100%"
            showPrintMargin
            showGutter={false}
            highlightActiveLine
            readOnly
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              enableMobileMenu: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
          <p className={css(ut.mt1, ut.fw500, { cr: 'var(--white-0-50)' })}>
            <RenderHtml
              html={__('Only valid JS object will work. for more details please check<a target="_blank" href="https://flatpickr.js.org/options/" rel="noreferrer"> the documentation for available configuration options</a>')}
            />
          </p>
        </div>
      </SimpleAccordion>

      <AdvancedDateTimeFieldAceModel
        labelModal={labelModal}
        setLabelModal={setLabelModal}
      />
    </>
  )
}
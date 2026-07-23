import { useAtom } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import EditIcn from '../../../../Icons/EditIcn'
import ut from '../../../../styles/2.utilities'
import sc from '../../../../styles/commonStyleEditorStyle'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import HTMLContentModal from '../../../CompSettings/CompSettingsUtils/HTMLContentModal'
import { truncatedString } from '../../../style-new/styleHelpers'
import Cooltip from '../../../Utilities/Cooltip'
import RenderHtml from '../../../Utilities/RenderHtml'

/**
 * Content Settings Component
 * Handles the HTML content editing interface for HTML fields
 */
export default function ContentSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [labelModal, setLabelModal] = useState(false)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])

  return (
    <>
      <div className={css(FieldStyle.fieldSection)}>
        <div className={css(ut.flxcb)}>
          <div className={css(ut.flxc)}>
            <b>Content: </b>
            <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
              <div className={css(ut.tipBody)}>
                {__('Edit the HTML field content by clicking on edit icon')}
              </div>
            </Cooltip>
          </div>
          <span
            data-testid="cntnt-edt-btn"
            role="button"
            tabIndex={-1}
            className={css(ut.mr2, ut.cp)}
            onClick={() => setLabelModal(true)}
            onKeyDown={() => setLabelModal(true)}
          >
            <EditIcn size={19} />
          </span>
        </div>
        <div
          data-testid="cntnt"
          role="button"
          tabIndex={-1}
          className={css(
            FieldStyle.input,
            ut.px10,
            ut.py5,
            sc.childPmargin0,
            { h: 'auto', fs: '12px !important' }
          )}
          onClick={() => setLabelModal(true)}
          onKeyDown={() => setLabelModal(true)}
        >
          <RenderHtml html={truncatedString(fieldData.content)} />
        </div>
      </div>

      <HTMLContentModal
        labelModal={labelModal}
        setLabelModal={setLabelModal}
      />
    </>
  )
}
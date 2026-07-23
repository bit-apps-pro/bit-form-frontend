import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import EditIcn from '../../../../../Icons/EditIcn'
import { __ } from '../../../../../Utils/i18nwrap'
import ut from '../../../../../styles/2.utilities'
import ErrorMessages from '../../../../../styles/ErrorMessages.style'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import DecisionBoxLabelModal from '../../../../CompSettings/CompSettingsUtils/DecisionBoxLabelModal'
import Cooltip from '../../../../Utilities/Cooltip'


/**
 * Label Settings Component
 * Handles the label editing interface for Decision Box fields
 */
export default function LabelSettings() {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [labelModal, setLabelModal] = useState(false)
  const { css } = useFela()

  const handleLabelClick = () => {
    setLabelModal(true)
  }

  return (
    <>
      <div className={css(FieldStyle.fieldSection)}>
        <div className={`flx flx-between ${FieldStyle.hover_tip}`}>
          <div className="flx">
            <b>Label </b>
            <Cooltip
              width={250}
              icnSize={17}
              className="hover-tip"
            >
              <div className="txt-body">
                {__('Edit your decision box label by clicking on edit icon')}
              </div>
            </Cooltip>
          </div>
          <span
            data-testid="lbl-edt-btn"
            role="button"
            tabIndex={-1}
            className="mr-2 cp"
            onClick={handleLabelClick}
            onKeyDown={handleLabelClick}
          >
            <EditIcn size={19} />
          </span>
        </div>
        <div
          className={`${css(ErrorMessages.errMsgBox)} ${css(ut.mt2)}`}
          tabIndex={0}
          role="button"
          onClick={handleLabelClick}
          onKeyDown={handleLabelClick}
        >
          <p className={css(ut.m0)}>Click to edit decision box label</p>
        </div>
      </div>

      <DecisionBoxLabelModal
        labelModal={labelModal}
        setLabelModal={setLabelModal}
        title={__('Edit Decision Box Label')}
      />
    </>
  )
}
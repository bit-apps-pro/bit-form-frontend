import { useFela } from 'react-fela'
import app from '../../../styles/app.style'
import { __ } from '../../../Utils/i18nwrap'
import Btn from '../../Utilities/Btn'

export default function WebHooksStepTwo({ saveConfig, edit, disabled }) {
  const { css } = useFela()
  return (
    edit
      ? (
        <div className="txt-center w-9 mt-3">
          <Btn
            variant="success"
            onClick={saveConfig}
            disabled={disabled}
          >
            {__('Save')}
          </Btn>
          {/* <button
            id="secondary-update-btn"
            onClick={saveConfig}
            className={`${css(app.btn)} btcd-btn-lg green sh-sm flx`}
            type="button"
            disabled={disabled}
          >
            {__('Save')}
          </button> */}
        </div>
      )
      : (
        <div className="txt-center" style={{ marginLeft: 120 }}>
          <h2 className="ml-3">{__('Successfully Integrated')}</h2>
          <Btn
            variant="success"
            onClick={saveConfig}
            className={`${css(app.btn)}`}
          >
            {__('Finish & Save')}
            {' '}
            &nbsp;✔
          </Btn>
        </div>
      )
  )
}

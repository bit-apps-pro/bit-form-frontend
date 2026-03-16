import { useFela } from 'react-fela'
import app from '../../../styles/app.style'
import { __ } from '../../../Utils/i18nwrap'
import Btn from '../../Utilities/Btn'

export default function IntegrationStepThree({ step, saveConfig, edit, disabled }) {
  const { css } = useFela()
  return (
    edit
      ? (
        <div className="txt-center w-9 mt-3">
          <Btn onClick={saveConfig} disabled={disabled}>{__('Update')}</Btn>
        </div>
      )
      : (
        <div
          className="btcd-stp-page txt-center"
          style={{ width: step === 3 && '90%', height: step === 3 && '100%' }}
        >
          <h2 className="ml-3">{__('Successfully Integrated')}</h2>
          <Btn
            variant="success"
            onClick={saveConfig}
            disabled={disabled}
            className={css(app.btn, { flxi: 'center' })}
          >
            {__('Finish & Save')}
            {' '}
            &nbsp;✔
          </Btn>
        </div>
      )
  )
}

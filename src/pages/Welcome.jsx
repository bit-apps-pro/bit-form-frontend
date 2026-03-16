// eslint-disable-next-line import/no-extraneous-dependencies
import { useFela } from 'react-fela'
import greeting from '../resource/img/home.svg'
import app from '../styles/app.style'
import { __ } from '../Utils/i18nwrap'

export default function Welcome({ setModal }) {
  const { css } = useFela()
  return (
    <div className="btcd-greeting">
      <img src={greeting} alt="" />
      <h2>{__('Welcome to Bit Form')}</h2>
      <div className="sub">
        {__('Thank you for installing Bit Form.')}
      </div>
      <div>
        {__('Modern Form builder and database management  system')}
        <br />
        {__('for Wordpress')}
      </div>
      <button
        data-testid="create-form-btn"
        onClick={() => setModal(true)}
        type="button"
        className={`${css(app.btn)} round btcd-btn-lg dp-blue`}
      >
        {__('Create First Form')}
      </button>
    </div>
  )
}

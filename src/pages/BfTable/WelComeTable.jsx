// eslint-disable-next-line import/no-extraneous-dependencies
import { useFela } from 'react-fela'
import { useNavigate, useParams } from 'react-router-dom'
import app from '../../styles/app.style'
import { __ } from '../../Utils/i18nwrap'

export default function WelComeTable({ setModal, createNewView }) {
  const { css } = useFela()
  const navigate = useNavigate()
  const { formType, formID } = useParams()
  return (
    <div className="btcd-greeting">
      <h2>{__('Welcome to Bit Form Views (Beta)')}</h2>
      <div className={css({ flx: 'center' })}>
        <button
          data-testid="create-table-btn"
          onClick={() => createNewView()}
          type="button"
          className={`${css(app.btn)} round btcd-btn-lg dp-blue`}
        >
          {__('Create First View')}
        </button>
      </div>
    </div>
  )
}

import { useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import { Link } from 'react-router-dom'
import { $connectedApps } from '../../GlobalStates/AppSettingsStates'
import PlusIcn from '../../Icons/PlusIcn'
import TrashIcn from '../../Icons/TrashIcn'
import style from '../../styles/integrations.style'
import { __ } from '../../Utils/i18nwrap'
import integs from '../../Utils/StaticData/availableIntegrationsList'
import Tip from '../Utilities/Tip'

const ConnectedAppsList = ({ allIntegURL, specificTypes = [], onClickAction = () => { }, allowAddNew, addNewAction = () => { }, deleteAction }) => {
  const { css } = useFela()
  const connectedApps = useAtomValue($connectedApps)

  const avoidIntegsForInfo = ['WooCommerce']
  const appsListForDisplay = specificTypes.length ? connectedApps.filter(app => specificTypes.includes(app.integration_type)) : connectedApps

  const getLogo = type => {
    for (let i = 0; i < integs.length; i += 1) {
      if (integs[i].type === type) {
        return (
          <img
            tabIndex={-1}
            className={css(style.integLogo)}
            alt={type || 'bitform integration logo'}
            loading="lazy"
            src={integs[i].logo}
          />
        )
      }
    }
    return null
  }

  return (
    <div className={`flx flx-center flx-wrp pb-3 mt-2 ${css({ gp: 10 })}`}>
      {appsListForDisplay?.map((inte, i) => (
        <div role="button" onClick={(e) => onClickAction(inte, i)} className={css(style.itegCard)} key={`inte-${i + 3}`}>
          <div>
            {getLogo(inte.integration_type)}
          </div>

          <div className="py-1" title={`${inte.integration_name} | ${inte.integration_type}`}>
            {!avoidIntegsForInfo.includes(inte.integration_type) ? (
              <Link
                to={`${allIntegURL}/app-info/${inte.id}`}
                className={css(style.integTitle)}
              >
                {inte.integration_name}
              </Link>
            ) : (
              <p className={css(style.integTitle)}>{inte.inte.integration_name}</p>
            )}
            <small className={css(style.integSubtitle)}>{inte.integration_type}</small>
          </div>
          <div className={`${css(style.actionWrp)} action-wrp`}>
            {deleteAction && (
              <Tip msg={__('Delete')}>
                <button
                  className={`${css(style.actionBtn)}`}
                  onClick={() => deleteAction(inte)}
                  type="button"
                  aria-label="App Delete Button"
                >
                  <TrashIcn size={18} />
                </button>
              </Tip>
            )}
          </div>
        </div>
      ))}
      {allowAddNew && (
        <div role="button" onClick={addNewAction} className={css(style.itegCard)}>
          <div>
            <PlusIcn size={40} />
          </div>
          <div className="py-1">
            <p className={css(style.integTitle)}>{__('Add New')}</p>
            <small className={css(style.integSubtitle)}>{__('App')}</small>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConnectedAppsList

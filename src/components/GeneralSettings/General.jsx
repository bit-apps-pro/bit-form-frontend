import { useAtom } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { useAsyncDebounce } from 'react-table'
import { $bits } from '../../GlobalStates/GlobalStates'
import CacheIcn from '../../Icons/CacheIcn'
import InfoIcn from '../../Icons/InfoIcn'
import tutorialLinks from '../../Utils/StaticData/tutorialLinks'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import useSWROnce from '../../hooks/useSWROnce'
import Loader from '../Loaders/Loader'
import Accordions from '../Utilities/Accordions'
import SingleToggle2 from '../Utilities/SingleToggle2'
import LearnmoreTip from '../Utilities/Tip/LearnmoreTip'
import GlobalMessages from './GlobalMessages'

export default function General() {
  const defaultConf = {
    cache_plugin: false,
    delete_table: false,
  }
  const [appConf, setAppConf] = useState(defaultConf)
  const [loading, setLoading] = useState(true)
  const [bits, setBits] = useAtom($bits)

  const { mutate: mutateGeneralSettings } = useSWROnce('bitforms_get_generel_settings', {}, {
    onSuccess: conf => {
      setLoading(false)
      return setAppConf(conf)
    },
  })

  const { css } = useFela()

  const saveSettings = (name) => {
    const config = { ...appConf }
    setLoading(true)
    const saveProm = bitsFetch({ config }, 'bitforms_save_generel_settings')
      .then((res) => {
        if ('success' in res && res.success) {
          mutateGeneralSettings(config)
          return 'Save successfully done'
        }
        delete config[name]
        setAppConf({ ...config })
      }).catch(() => 'Failed to save')
    toast.promise(saveProm, {
      success: data => data,
      failed: data => data,
      loading: __('Saving Generel Settings...'),
    })
  }
  const debouncedUpdateConfig = useAsyncDebounce(saveSettings, 500)

  const handler = ({ target: { name, checked } }) => {
    const config = { ...appConf }
    config[name] = checked
    setAppConf(config)
    debouncedUpdateConfig(name)
  }

  const permissionHandler = ({ target: { checked } }) => {
    bitsFetch({
      permission: checked,
    }, 'bitforms_analytics_permission')
      .then(() => {
        setBits(prevBits => ({ ...prevBits, permission: checked }))
      })
  }

  return (
    <div>
      <div className={css({ flx: 'align-center' })}>
        <h2>{__('Global Settings')}</h2>
        {loading && <Loader height={40} />}
      </div>
      <Accordions
        customTitle={(
          <span className={css({ dy: 'flex' })}>
            <b>
              <span className="mr-2">
                <InfoIcn size="16" />
              </span>
              {__('Validation Error/Invalid Message')}
            </b>
            <LearnmoreTip {...tutorialLinks.globalValidationMsg} />
          </span>
        )}
        cls="w-10 mt-3"
        proProperty="restrict_form"
      >
        <GlobalMessages setLoading={setLoading} />
      </Accordions>
      <div className="w-10 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className="flx">
            <span className="mr-2">
              <CacheIcn size="16" />
            </span>
            <b>{__('Generate Token after page load to prevent conflict with cache plugins.')}</b>
          </div>
          <SingleToggle2 action={handler} name="cache_plugin" checked={!!appConf?.cache_plugin} className="flx" />
        </div>
      </div>

      <div className="w-10 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className="flx">
            <span className="mr-2">
              <CacheIcn size="16" />
            </span>
            <b>{__('Delete all data table when delete plugin.')}</b>
          </div>
          <SingleToggle2 action={handler} name="delete_table" checked={appConf?.delete_table || ''} className="flx" />
        </div>
      </div>
      <div className="w-10 mt-3">
        <div className="flx flx-between sh-sm br-10 btcd-setting-opt">
          <div className="flx">
            <span className="mr-2">
              <CacheIcn size="16" />
            </span>
            <b>{__('Usage Reporting Opt In.')}</b>
            <LearnmoreTip
              title="Share Usage report for improve Bit Form."
              link="https://bitapps.pro/privacy-policy/"
            />
          </div>
          <SingleToggle2
            action={permissionHandler}
            name="permission"
            checked={bits.permission}
            className="flx"
          />
        </div>
      </div>

    </div>
  )
}

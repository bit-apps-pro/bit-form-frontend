import { useAtomValue, useSetAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { $bits, $formId } from '../GlobalStates/GlobalStates'
import { generateUpdateFormData, getConfirmationStyle, getStatesToReset, setFormReponseDataToStates, setStyleRelatedStates } from '../Utils/Helpers'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import Loader from './Loaders/Loader'
import Modal from './Utilities/Modal'
import Progressbar from './Utilities/Progressbar'
import themeProvider from './style-new/themes/themeProvider'

export default function MigrationModal() {
  const bits = useAtomValue($bits)
  const setFormId = useSetAtom($formId)
  const [migratingCount, setMigratingCount] = useState(0)
  const [totalForms, setTotalForms] = useState(0)
  const [showSupportInfo, setShowSupportInfo] = useState(false)
  const { css } = useFela()
  const atomResetters = getStatesToReset().map(stateAtom => useResetAtom(stateAtom))

  useEffect(() => {
    if (bits.isMigratingToV2) {
      document.body.style.overflow = 'hidden'
      // do not close this window
      window.onbeforeunload = () => true

      bitsFetch({}, 'bitforms_get_migrated_form_contents')
        .then((res) => {
          if (res.success && res.data.length) {
            setTotalForms(res.data.length)
            const updateFormPromises = []
            res.data.forEach(formData => {
              const { id: formID } = formData
              setFormId(formID)
              const fieldsArr = Object.entries(formData.form_content.fields)
              const { themeVars, themeColors, styles } = themeProvider('bitformDefault', fieldsArr, formID)
              setFormReponseDataToStates(formData)
              styles.lgLightStyles.confirmations = getConfirmationStyle(formData)
              setStyleRelatedStates({ themeVars, themeColors, styles })
              const migratedFormData = generateUpdateFormData(formID)
              const updateFormPromise = bitsFetch(migratedFormData, 'bitforms_update_form').then(() => { setMigratingCount(prevCount => prevCount + 1) })
              updateFormPromises.push(updateFormPromise)
              atomResetters.forEach(resetAtom => resetAtom())
            })
            Promise.all(updateFormPromises)
              .then(() => {
                bitsFetch({}, 'bitforms_migrate_to_v2_complete')
                  .then(() => {
                    window.onbeforeunload = null
                    window.location.reload()
                  })
              })
          } else {
            setShowSupportInfo(true)
          }
        })
    }
  }, [])

  const getMigratedPercentage = () => {
    if (migratingCount === 0) return 0
    return Math.round((migratingCount / totalForms) * 100)
  }

  return (
    <Modal sm show={bits.isMigratingToV2} showCloseBtn={false}>
      <div className="flx flx-col flx-center">
        {showSupportInfo && (
          <>
            <h3 className="mb-2">{__('Migration Issue Detected')}</h3>
            <p className="m-0 mb-2 txt-center">{__('There may have been a problem during auto-migrating your Bit Forms from V1 to V2.')}</p>
            <p className="mb-2">
              {__('Please contact support for assistance at ')}
              <a href="mailto:support@bitapps.pro" rel="noreferrer" className={css({ td: 'underline !important' })}>
                support@bitapps.pro
              </a>
            </p>
          </>
        )}
        {!showSupportInfo && (
          <>
            <h3 className="mb-0">{__('Migrating to V2')}</h3>
            <p className="mb-2">{__('Please wait while we migrate your data to V2')}</p>
            {!totalForms && <Loader />}
            {!!totalForms && (
              <>
                <div className="flx flx-center" style={{ width: '70%' }}><Progressbar value={getMigratedPercentage()} /></div>
                <p className="m-0">{`Migrated ${migratingCount} out of ${totalForms} forms`}</p>
              </>
            )}
            <p className="m-0 mt-2">{__('This may take a few minutes...')}</p>
            <p className="mt-0 mb-2">{__('Meanwhile do not close this window.')}</p>
          </>
        )}

      </div>
    </Modal>
  )
}

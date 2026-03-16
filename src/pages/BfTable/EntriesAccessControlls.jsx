import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { assignNestedObj } from '../../components/style-new/styleHelpers'
import { compareVersions } from '../../components/Template/templateHelpers'
import Accordions from '../../components/Utilities/Accordions'
import LearnmoreTip from '../../components/Utilities/Tip/LearnmoreTip'
import { $bits, $formPermissions } from '../../GlobalStates/GlobalStates'
import EditIcon from '../../Icons/EditIcon'
import EyeIcon from '../../Icons/EyeIcon'
import { IS_PRO } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import tutorialLinks from '../../Utils/StaticData/tutorialLinks'

export default function EntriesAccessControlls() {
  const [formPermissions, setFormPermissions] = useAtom($formPermissions)
  const bits = useAtomValue($bits)
  const { css } = useFela()
  const { userRoles, user } = bits
  const roles = Object.keys(userRoles).filter(role => role !== 'administrator').map(role => ({ label: userRoles[role].name, value: role }))
  const roleWithAllLoggedInUsers = [{ label: 'All Logged In Users', value: 'all_logged_in_users' }, ...roles]
  const { entryEditAccess, entryViewAccess } = formPermissions || {}

  const handleFormPermission = (propPath, value) => {
    if (!IS_PRO) return
    setFormPermissions(prevState => create(prevState, drft => {
      assignNestedObj(drft, propPath, value)
    }))
  }
  return (
    <div>
      <h3>Views And Edit Access</h3>
      {!compareVersions(bits?.proInfo?.installedVersion, '2.9.0') && (
        <p>
          <strong style={{ color: 'red' }}> Note:</strong>
          {' '}
          To use this feature you need Bit Form Pro(Version: 2.9.0)
          {' '}
        </p>
      )}
      <Accordions
        customTitle={(
          <span className={css({ flx: 'align-center' })}>
            <span className="mr-2"><EyeIcon size={18} /></span>
            <b>
              {__('Prevent Public View of Entries')}
            </b>
            <small className="ml-1">{__('(Allow only selected rules to View Entries)')}</small>
            <LearnmoreTip {...tutorialLinks.allowUserToView} />
          </span>
        )}
        toggle
        action={(e) => handleFormPermission('entryViewAccess->preventPublicAccess', e.target.checked)}
        checked={entryViewAccess?.preventPublicAccess}
        cls="w-10 mt-3"
        isPro
        proProperty="is_login"
      >
        <div className={css({ p: '5px 10px' })}>
          <div className={css(style.inputWrp)}>
            <span>{__('Allow Roles to view own entries')}</span>
            <MultiSelect
              defaultValue={entryViewAccess?.ownEntries || []}
              className="btcd-paper-drpdwn w-6"
              options={roleWithAllLoggedInUsers}
              onChange={val => handleFormPermission('entryViewAccess->ownEntries', val)}
            />
          </div>
          <div className={css(style.inputWrp)}>
            <span>{__('Allow Roles to view Other\'s entries')}</span>
            <MultiSelect
              defaultValue={entryViewAccess?.othersEntries || []}
              className="btcd-paper-drpdwn w-6"
              options={roleWithAllLoggedInUsers}
              onChange={val => handleFormPermission('entryViewAccess->othersEntries', val)}
            />
          </div>
        </div>
      </Accordions>
      <Accordions
        customTitle={(
          <span className={css({ dy: 'flex' })}>
            <span className="mr-2"><EditIcon size={20} /></span>
            <b>
              {__('Allow Users to Edit Form Entries')}
            </b>
            <LearnmoreTip {...tutorialLinks.allowUserToEdit} />
          </span>
        )}
        toggle
        action={(e) => handleFormPermission('entryEditAccess->allowEntriesEdit', e.target.checked)}
        checked={entryEditAccess?.allowEntriesEdit}
        cls="w-10 mt-3"
        isPro
        proProperty="is_login"
      >
        <div className={css({ p: '5px 10px' })}>
          <div className={css(style.inputWrp)}>
            <span>{__('Allow Roles to edit own entries')}</span>
            <MultiSelect
              defaultValue={entryEditAccess?.ownEntries || []}
              className="btcd-paper-drpdwn w-6"
              options={roleWithAllLoggedInUsers}
              onChange={val => handleFormPermission('entryEditAccess->ownEntries', val)}
            />
          </div>
          <div className={css(style.inputWrp)}>
            <span>{__('Allow Roles to edit Other\'s entries')}</span>
            <MultiSelect
              defaultValue={entryEditAccess?.othersEntries || []}
              className="btcd-paper-drpdwn w-6"
              options={roles}
              onChange={val => handleFormPermission('entryEditAccess->othersEntries', val)}
            />
          </div>
        </div>
      </Accordions>
    </div>

  )
}
const style = {
  inputWrp: {
    dy: 'flex',
    jc: 'space-between',
    ai: 'center',
    mb: 10,
  },
}

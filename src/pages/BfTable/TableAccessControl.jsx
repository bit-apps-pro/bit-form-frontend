import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { $bits, $frontendTable, $updateTblBtn } from '../../GlobalStates/GlobalStates'
import { __ } from '../../Utils/i18nwrap'
import FieldSettingsDivider from '../../components/CompSettings/CompSettingsUtils/FieldSettingsDivider'
import CheckBox from '../../components/Utilities/CheckBox'
import Cooltip from '../../components/Utilities/Cooltip'
import RenderHtml from '../../components/Utilities/RenderHtml'
import { assignNestedObj } from '../../components/style-new/styleHelpers'
import FieldStyle from '../../styles/FieldStyle.style'

export default function TableAccessControl() {
  const { css } = useFela()
  const bits = useAtomValue($bits)
  const setUpdateTblBtn = useSetAtom($updateTblBtn)
  const { userRoles, user } = bits
  const roles = Object.keys(userRoles).map(role => ({ label: userRoles[role].name, value: role }))
  const users = Object.keys(user).map(id => ({ label: user[id].name, value: id }))

  const enableEditButton = () => setUpdateTblBtn(prevState => ({ ...prevState, unsaved: true }))

  const [frontendTable, setFrontendTable] = useAtom($frontendTable)
  const accessControl = frontendTable?.access_control || {}
  const changeAccessFor = (val) => {
    console.log({ val })
    setFrontendTable(prvSetting => create(prvSetting, drft => {
      assignNestedObj(drft, 'access_control->accessFor', val)
    }))
    enableEditButton()
  }

  const lists = (val, path) => {
    const newVal = val ? val.split(',') : []
    setFrontendTable(prvSetting => create(prvSetting, drft => {
      assignNestedObj(drft, path, newVal)
    }))
    enableEditButton()
  }

  const editableDataAccess = (e) => {
    const val = e.target.value
    setFrontendTable(prvSetting => create(prvSetting, drft => {
      assignNestedObj(drft, 'access_control->editableData', val)
    }))
    enableEditButton()
  }

  return (
    <div className={css(accsCtrlStyle.main)}>
      <FieldSettingsDivider />
      <div className={css(accsCtrlStyle.accSec)}>
        <div className={css({ flx: 'center' })}>

          <CheckBox
            radio
            onChange={e => changeAccessFor(e.target.value)}
            title={<small className="txt-dp">{__('By Roles')}</small>}
            checked={accessControl?.accessFor === 'all'}
            value="all"
          />
          <Cooltip width="250" icnSize="17">
            <div className="txt-body">
              <RenderHtml html="Enable for this option to Entry view, edit, and single entry view access for Wordpress Default user role" />
            </div>
          </Cooltip>
        </div>
        <div className={css({ flx: 'center' })}>
          <CheckBox
            radio
            onChange={e => changeAccessFor(e.target.value)}
            title={<small className="txt-dp">{__('Selected User')}</small>}
            checked={accessControl?.accessFor === 'user'}
            value="user"
          />
          <Cooltip width="250" icnSize="17">
            <div className="txt-body">
              <RenderHtml html="Enable for only Selected User. Who can edit, update or delete posts, or which you given access." />
            </div>
          </Cooltip>
        </div>
      </div>
      {accessControl?.accessFor === 'user' && (
        <>
          <div className={css(accsCtrlStyle.wrp)}>
            <span>{__('Users')}</span>
            <MultiSelect
              defaultValue={accessControl?.user?.ids || []}
              className="btcd-paper-drpdwn w-6"
              options={users}
              onChange={val => lists(val, 'access_control->user->ids')}
            />
          </div>
          <div className={css(accsCtrlStyle.wrp)}>
            <span>{__('Access Setting')}</span>
            <MultiSelect
              defaultValue={accessControl?.user?.modifyAccess}
              className="btcd-paper-drpdwn w-6"
              options={[
                { label: __('Entry View'), value: 'entryView' },
                { label: __('Entry Edit'), value: 'entryEdit' },
                { label: __('Single Entry View'), value: 'singleEntryView' },
              ]}
              onChange={val => lists(val, 'access_control->user->modifyAccess')}
            />
          </div>
        </>
      )}
      {accessControl?.accessFor === 'all' && (
        <>
          <div className={css(accsCtrlStyle.wrp)}>
            <span>{__('Entry View')}</span>
            <MultiSelect
              defaultValue={accessControl?.all?.entryView || []}
              className="btcd-paper-drpdwn w-6"
              options={roles}
              onChange={val => lists(val, 'access_control->all->entryView')}
            />
          </div>

          <div className={css(accsCtrlStyle.wrp)}>
            <span>{__('Entry Edit')}</span>
            <MultiSelect
              defaultValue={accessControl?.all?.entryEdit || []}
              className="btcd-paper-drpdwn w-6"
              options={roles}
              onChange={val => lists(val, 'access_control->all->entryEdit')}
            />
          </div>
          <div className={css(accsCtrlStyle.wrp)}>
            <span>{__('Single Entry Details View')}</span>
            <MultiSelect
              defaultValue={accessControl?.all?.singleEntryDetailsView || []}
              className="btcd-paper-drpdwn w-6"
              options={roles}
              onChange={val => lists(val, 'access_control->all->singleEntryDetailsView')}
            />
          </div>
        </>
      )}
      <FieldSettingsDivider />
      <div className={css(accsCtrlStyle.wrp)}>
        <span className={css({ w: 100 })}>{__('Entry Edit')}</span>
        <select className={css(FieldStyle.input)} value={accessControl?.editableData} onChange={editableDataAccess}>
          <option value="all">{__('All Submitted Response')}</option>
          <option value="own">{__('Own Submitted Response')}</option>
        </select>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

    </div>
  )
}

const accsCtrlStyle = {
  main: {
    mxh: '73vh',
    owy: 'auto',
  },
  wrp: {
    px: 10,
    py: 5,
    flx: 'center-between',
  },
  accSec: {
    flx: 'center-between',
    w: '80%',
  },
}

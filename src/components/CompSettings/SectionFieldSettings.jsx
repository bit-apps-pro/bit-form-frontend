/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAtom } from 'jotai'
import { memo } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useParams } from 'react-router-dom'
import { $fields } from '../../GlobalStates/GlobalStates'
import { deepCopy } from '../../Utils/Helpers'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldLabelSettings from './CompSettingsUtils/FieldLabelSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import HelperTxtSettings from './CompSettingsUtils/HelperTxtSettings'
import SubTitleSettings from './CompSettingsUtils/SubTitleSettings'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

function SectionFieldSettings() {
  const { fieldKey: fldKey } = useParams()

  if (!fldKey) return <>No field exist with this field key</>
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])

  return (
    <div className="">
      <FieldSettingTitle
        title="Field Settings"
        subtitle={fieldData.typ}
        fieldKey={fldKey}
      />

      <FieldLabelSettings />

      <FieldSettingsDivider />

      <SubTitleSettings />

      <FieldSettingsDivider />

      <AdminLabelSettings />

      <FieldSettingsDivider />

      <SizeAndPosition />

      <FieldSettingsDivider />

      <HelperTxtSettings />

      <FieldSettingsDivider />

      {/* <RequiredSettings />

      <FieldSettingsDivider /> */}

      <FieldHideSettings />

      <FieldSettingsDivider />

    </div>
  )
}

export default memo(SectionFieldSettings)

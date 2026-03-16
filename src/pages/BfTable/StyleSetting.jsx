import { useFela } from 'react-fela'
import FieldSettingsDivider from '../../components/CompSettings/CompSettingsUtils/FieldSettingsDivider'
import Caption from './TableStyleLeyerComponent/Caption'
import ClmHead from './TableStyleLeyerComponent/ClmHead'
import EditButton from './TableStyleLeyerComponent/EditButton'
import PageSelectBox from './TableStyleLeyerComponent/PageSelectBox'
import PaginationButton from './TableStyleLeyerComponent/PaginationButton'
import SearchBox from './TableStyleLeyerComponent/SearchBox'
import Table from './TableStyleLeyerComponent/Table'
import TableRow from './TableStyleLeyerComponent/TableRow'
import TableWrp from './TableStyleLeyerComponent/TableWrp'
import ViewButton from './TableStyleLeyerComponent/ViewButton'

export default function StyleSetting() {
  const { css } = useFela()
  return (
    <div className={css(settingStyle.main)}>
      <FieldSettingsDivider />
      <TableWrp />
      <FieldSettingsDivider />
      <Caption />
      <FieldSettingsDivider />
      <SearchBox />
      <FieldSettingsDivider />
      <Table />
      <FieldSettingsDivider />
      <ClmHead />
      <FieldSettingsDivider />
      <TableRow />
      <FieldSettingsDivider />
      <EditButton />
      <FieldSettingsDivider />
      <ViewButton />
      <FieldSettingsDivider />
      <PaginationButton />
      <FieldSettingsDivider />
      <PageSelectBox />
      <FieldSettingsDivider />
    </div>
  )
}

const settingStyle = {
  main: {
    mxh: '73vh',
    owy: 'auto',
  },
}

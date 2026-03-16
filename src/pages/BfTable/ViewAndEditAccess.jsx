import { useFela } from 'react-fela'
import { IS_PRO } from '../../Utils/Helpers'
import ProOverlay from '../../components/CompSettings/StyleCustomize/ChildComp/ProOverlay'
import AllViews from './AllViews'
import EntriesAccessControlls from './EntriesAccessControlls'

export default function ViewAndEditAccess() {
  const { css } = useFela()

  return (
    <div className={css({ pr: 75 })}>
      {!IS_PRO && (
        <ProOverlay style={{ height: '90%', left: '30px', width: '95%', 'margin-top': '40px' }} />
      )}
      <EntriesAccessControlls />
      <hr />
      <AllViews />
    </div>
  )
}

import { useFela } from 'react-fela'
import TrashIcn from '../../Icons/TrashIcn'
import ut from '../../styles/2.utilities'
import sc from '../../styles/commonStyleEditorStyle'
import { __ } from '../../Utils/i18nwrap'

export default function StylePropertyBlock({ title, delPropertyHandler, children }) {
  const { css } = useFela()
  return (
    <div className={css(ut.flxcb, ut.mt2, sc.propsElemContainer)}>
      <div className={css(ut.flxc, ut.ml1)}>
        <button
          title="Delete Property"
          onClick={delPropertyHandler}
          className={`${css(ut.stylePropDeleteBtn)} delete-btn`}
          type="button"
        >
          <TrashIcn size="14" />
        </button>
        <span className={css(ut.stylePropertyLabel)}>{__(title)}</span>
      </div>
      {children}
    </div>
  )
}

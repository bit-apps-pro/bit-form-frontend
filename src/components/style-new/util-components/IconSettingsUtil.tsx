/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react'
import { useFela } from 'react-fela'
import CloseIcn from '../../../Icons/CloseIcn'
import EditIcn from '../../../Icons/EditIcn'
import ut from '../../../styles/2.utilities'
import Modal from '../../Utilities/Modal'
import Tip from '../../Utilities/Tip'
import { IconSettingsProps } from './Icons'
import IconsUtil from './IconsUtil'

export default function IconSettingsUtil({
  id, classNames, label="Icon", alt, iconSrc, setIconHandler, removeIconHandler, uploadLbl, selected
}:IconSettingsProps) {
  const [icnMdl, setIcnMdl] = useState(false)
  const { css } = useFela()
  const setIconAction = (src:string) => {
    setIconHandler(src)
    setIcnMdl(false)
  }
  return (
    <div className={`${css(ut.flxcb)} ${classNames} pos-rel`}>
      <div className={css(ut.flxcb)}>
        {iconSrc && (
          <img
            src={iconSrc}
            title="Icon"
            alt={alt || label}
            width="22"
            height="22"
          />
        )}

        <div className={css(s.flx)}>
          <Tip msg="Change">
            <button
              data-testid={`${id}-edt-btn`}
              type="button"
              onClick={() => setIcnMdl(true)}
              className={css(ut.icnBtn)}
            >
              <EditIcn size={18} />
            </button>
          </Tip>
          {iconSrc && removeIconHandler && (
            <Tip msg="Remove">
              <button
                data-testid={`${id}-rmv-btn`}
                onClick={removeIconHandler}
                className={css(ut.icnBtn)}
                type="button"
              >
                <CloseIcn size="13" />
              </button>
            </Tip>
          )}
        </div>

      </div>
      <Modal
        autoHeight
        show={icnMdl}
        setModal={setIcnMdl}
        className="o-v"
        title="Image"
      >
        <div className="pos-rel" />

        <IconsUtil
          onSaveIcon={setIconAction}
          onRemoveIcon={removeIconHandler}
          uploadLbl={uploadLbl}
          selected={selected}
        />
      </Modal>
    </div>
  )
}

const s = {
  flx: {
    dy: 'flex',
    bc: '#f7f7f7',
    brs: '5px',
  },

}

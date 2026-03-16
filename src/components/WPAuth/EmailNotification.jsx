/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { $fieldsArr, $updateBtn } from '../../GlobalStates/GlobalStates'
import { __ } from '../../Utils/i18nwrap'
import Btn from '../Utilities/Btn'
import Modal from '../Utilities/Modal'
import TinyMCE from '../Utilities/TinyMCE'

export default function EmailNotification({
  dataConf, setDataConf, type, showMdl, setshowMdl, tamplate = '', title,
}) {
  const setUpdateBtn = useSetAtom($updateBtn)
  const formFields = useAtomValue($fieldsArr)
  const { css } = useFela()
  const data = type ? dataConf[type] : dataConf
  const temBody = data?.body ? data?.body : tamplate

  const handleBody = (propName, value) => {
    setDataConf(tmpConf => create(tmpConf, draft => {
      // eslint-disable-next-line no-param-reassign
      const tmp = type ? draft[type] : draft
      tmp[propName] = value
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }
  const cancelModal = () => {
    setTimeout(() => {
      setDataConf(tmpConf => create(tmpConf, draft => {
        // eslint-disable-next-line no-param-reassign
        const tmp = type ? draft[type] : draft
        tmp.body = tamplate
        // eslint-disable-next-line no-param-reassign
        tmp.sub = 'Email Subject'
      }))
      setshowMdl(false)
    })
  }

  const handleInput = e => {
    setDataConf(tmpConf => create(tmpConf, draft => {
      const { name, value } = e.target
      const tmp = type ? draft[type] : draft
      // eslint-disable-next-line no-param-reassign
      tmp[name] = value
    }))
    setUpdateBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  return (
    <Modal md show={showMdl} setModal={setshowMdl} title={title} style={{ overflow: 'auto' }}>
      <div>
        <div className={css(styles.wrap)}>

          <fieldset className={css(styles.fieldset)}>
            <legend className={css(styles.legend)}>Verify Activation Mail:</legend>
            <div className="mt-3 flx">
              <label style={{ width: 100 }}>Subject:</label>
              <input
                onChange={handleInput}
                name="sub"
                type="text"
                className="btcd-paper-inp w-9"
                placeholder="Email Subject Here"
                value={data?.sub}
              />
            </div>
            <div className="mt-1">
              <label>{__('Body:')}</label>
              <TinyMCE
                id={`mail-tem-${type}`}
                formFields={formFields}
                value={temBody}
                onChangeHandler={(value) => handleBody('body', value)}
                width="100%"
              />
            </div>
          </fieldset>

          <fieldset className={css(styles.fieldset)}>
            <legend className={css(styles.legend)}>Pending User Mail:</legend>
            <div className="mt-3 flx">
              <label style={{ width: 100 }}>Subject:</label>
              <input
                onChange={handleInput}
                name="pendingUserSub"
                type="text"
                className="btcd-paper-inp w-9"
                placeholder="Email Subject Here"
                value={data?.pendingUserSub}
              />
            </div>
            <div className="mt-1">
              <label>{__('Body:')}</label>

              <TinyMCE
                id={`mail-pending-user-${type}`}
                formFields={formFields}
                value={data?.pendingUserBody}
                onChangeHandler={(value) => handleBody('pendingUserBody', value)}
                width="100%"
              />
            </div>
          </fieldset>

          <fieldset className={css(styles.fieldset)}>
            <legend className={css(styles.legend)}>Admin approval Mail:</legend>
            <div className="mt-3 flx">
              <label style={{ width: 100 }}>Subject:</label>
              <input
                onChange={handleInput}
                name="adminApprovalSub"
                type="text"
                className="btcd-paper-inp w-9"
                placeholder="Email Subject Here"
                value={data?.adminApprovalSub}
              />
            </div>
            <div className="mt-1">
              <label>{__('Body:')}</label>

              <TinyMCE
                id={`mail-admin-approval-${type}`}
                formFields={formFields}
                value={data?.adminApprovalBody}
                onChangeHandler={(value) => handleBody('adminApprovalBody', value)}
                width="100%"
              />
            </div>
          </fieldset>

          <fieldset className={css(styles.fieldset)}>
            <legend className={css(styles.legend)}>User Rejection Mail:</legend>
            <div className="mt-3 flx">
              <label style={{ width: 100 }}>Subject:</label>
              <input
                onChange={handleInput}
                name="userRejectionSub"
                type="text"
                className="btcd-paper-inp w-9"
                placeholder="Email Subject Here"
                value={data?.userRejectionSub}
              />
            </div>
            <div className="mt-1">
              <label>{__('Body:')}</label>

              <TinyMCE
                id={`mail-user-rejection-${type}`}
                // formFields={formFields}
                value={data?.userRejectionBody}
                onChangeHandler={(value) => handleBody('userRejectionBody', value)}
                width="100%"
                smartTags={false}
              />
            </div>
          </fieldset>
        </div>
        <div className="mt-2 f-right flx mb-3">
          <Btn variant="danger-outline" className={css({ mr: 5 })} onClick={cancelModal}>{__('Cancel')}</Btn>
          <Btn onClick={() => setshowMdl(false)}>
            {__('Save')}
            &nbsp;
          </Btn>
        </div>
      </div>
    </Modal>
  )
}

const styles = {
  fieldset: {
    b: '1px solid var(--gray-3)',
    bd: 'var(--gray-1)',
    p: 10,
    brs: 5,
    mb: 10,
    w: '100%',
    h: '100%',
  },
  legend: {
    fs: 16,
    fw: 600,
    mb: 5,
    ta: 'center',
    color: 'var(--black-0)',
  },
  wrap: {
    mnh: 300,
    mxh: '80vh',
    owy: 'auto',
  },
}

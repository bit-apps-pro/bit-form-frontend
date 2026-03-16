import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useNavigate, useParams } from 'react-router-dom'
import { $fieldsArr, $frontendTable, $updateTblBtn, $viewId } from '../../GlobalStates/GlobalStates'
import CustomCodeEditor from '../../components/CompSettings/CustomCodeEditor'
import Grow from '../../components/CompSettings/StyleCustomize/ChildComp/Grow'
import TableBuilderSettings from '../../components/TableBuilderSettings'
import Modal from '../../components/Utilities/Modal'
import StyleSegmentControl from '../../components/Utilities/StyleSegmentControl'
import OptionToolBarStyle from '../../styles/OptionToolbar.style'
import RenderTableStyle from './RenderTableStyle'

export default function TableContents() {
  const { css } = useFela()
  const [isLoading, setIsLoading] = useState(false)
  const [frontendTable, setFrontendTable] = useAtom($frontendTable)
  const [settingsModalTab, setSettingsModalTab] = useState('Builder Settings')
  const [updateTblBtn, setUpdateTblBtn] = useAtom($updateTblBtn)
  const [modal, setModal] = useState(false)
  const [singleEntryModel, setSingleEntryModal] = useState(false)
  const formFields = useAtomValue($fieldsArr)
  const tableid = useAtomValue($viewId)
  const { formID, viewId } = useParams()
  const navigate = useNavigate()
  const tableName = frontendTable.table_name
  const tableHeader = frontendTable?.table_config?.columnsMap || []
  const caption = frontendTable?.table_config?.caption || ''
  const viewBtn = frontendTable?.table_config?.actionsBtn.viewButton
  const editBtn = frontendTable?.table_config?.actionsBtn.editButton
  const head = frontendTable?.table_config?.actionsBtn.head
  let currentTableId = viewId

  if (viewId === 'new') {
    currentTableId = tableid
  }

  const actionHeader = () => {
    if (head?.show === true) {
      return (
        <th width={head.w}>{head.thead}</th>
      )
    }
    return false
  }

  const viewBtnMarkup = () => {
    if (viewBtn.show) {
      return (
        <button
          type="button"
          className={`bf${formID}-${currentTableId}-tbl-view-btn`}
        >
          {viewBtn.btnTxt}
        </button>
      )
    }
  }
  const editBtnMarkup = () => {
    if (editBtn.show) {
      return (
        <button
          type="button"
          className={`bf${formID}-${currentTableId}-tbl-edit-btn`}
        >
          {editBtn.btnTxt}
        </button>
      )
    }
  }

  return (
    <>
      <div className={css(builderStyle.builder)}>
        <RenderTableStyle />
        <div className={`bf${formID}-${currentTableId}-tbl-wrp`}>
          {caption && (
            <div className={`bf${formID}-${currentTableId}-tbl-caption`}>{caption}</div>
          )}
          <div className={`bf${formID}-${currentTableId}-tbl-top-bar`}>
            <label aria-label="search-bar" htmlFor="search-box">
              Search
              <input
                id="search-box"
                className={`bf${formID}-${currentTableId}-serc-bx`}
                type="text"
                name="search"
              />
            </label>
          </div>
          <table className={`bf${formID}-${currentTableId}-tbl`}>
            <thead className={`bf${formID}-${currentTableId}-thead`}>
              <tr>
                {tableHeader.map(cell => <th width={cell?.w}>{cell.thead}</th>)}
                {actionHeader()}
              </tr>
            </thead>
            <tbody className={`bf${formID}-${currentTableId}-tbody`}>
              {
                Array(4).fill().map(() => (
                  <tr>
                    {tableHeader.map(cell => <td width={cell.w}>Data Cell</td>)}
                    {actionHeader() && (
                      <td>
                        <div className={`bf${formID}-${currentTableId}-tbl-action-btns`}>
                          {editBtnMarkup()}
                          {viewBtnMarkup()}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              }
            </tbody>
          </table>
          <div className={`bf${formID}-${currentTableId}-tbl-footer`}>
            <span>Total Response 100</span>
            <div className="pgn">
              <button className={`bf${formID}-${currentTableId}-pgn-btn`} type="button">&#171;</button>
              <button className={`bf${formID}-${currentTableId}-pgn-btn`} type="button">&#8249;</button>
              <button className={`bf${formID}-${currentTableId}-pgn-btn`} type="button">&#8250;</button>
              <button className={`bf${formID}-${currentTableId}-pgn-btn`} type="button">&#187;</button>
              <span>Page 1 of 10</span>
              <select className={`bf${formID}-${currentTableId}-tbl-pgn-slt`} name="limit" id="limit">
                <option value="">10</option>
                <option value="">20</option>
                <option value="">30</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <Modal
        md
        autoHeight
        show={modal}
        setModal={setModal}
        className="o-v"
        title={(
          <div className={css(OptionToolBarStyle.modalTitleBar)}>
            <StyleSegmentControl
              width={300}
              wideTab
              tipPlace="bottom"
              defaultActive={settingsModalTab}
              onChange={setSettingsModalTab}
              options={[
                { label: 'Builder Settings' },
                { label: 'Custom Code' },
              ]}
            />
          </div>
        )}
        closeOnOutsideClick={false}
      >
        <Grow open={settingsModalTab === 'Builder Settings'}>
          <TableBuilderSettings />
        </Grow>
        <Grow open={settingsModalTab === 'Custom Code'}>
          <CustomCodeEditor />
        </Grow>
      </Modal>

    </>
  )
}

const builderStyle = {
  topSection: {
    flx: 'center-between',
    // jc: 'end',
    bb: '0.5px solid var(--white-0-83)',
    p: '8px',
  },
  builder: {
    p: 10,
  },
  settingBtn: {
    mr: 10,
    '&:hover': {
      // bg: 'var(--white-0-86)',
      cr: 'var(--b-50)',
    },
  },
}

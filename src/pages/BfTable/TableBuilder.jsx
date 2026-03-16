import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { startTransition, useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { $fieldsArr, $frontendTable, $frontendTables, $newTableId, $updateTblBtn, $viewId } from '../../GlobalStates/GlobalStates'
import BackIcn from '../../Icons/BackIcn'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../../components/Loaders/Loader'
import LoaderSm from '../../components/Loaders/LoaderSm'
import Btn from '../../components/Utilities/Btn'
import CoolCopy from '../../components/Utilities/CoolCopy'
import Modal from '../../components/Utilities/Modal'
import TinyMCE from '../../components/Utilities/TinyMCE'
import { assignNestedObj } from '../../components/style-new/styleHelpers'
import FieldStyle from '../../styles/FieldStyle.style'
import TableBuilderSettings from './TableBuilderSettings'
import TableContents from './TableContents'
import defaultTableSettings from './defaultTableSettings'

export default function TableBuilder() {
  const { viewId, formID, formType } = useParams()
  const { css } = useFela()
  const newTableId = useAtomValue($newTableId)
  const [tableid, setTableId] = useAtom($viewId)
  const [frontendTable, setFrontendTable] = useAtom($frontendTable)
  const [updateTblBtn, setUpdateTblBtn] = useAtom($updateTblBtn)
  const [singleEntryModel, setSingleEntryModal] = useState(false)
  const [frontendTables, setFrontendTables] = useAtom($frontendTables)
  const [initialLoading, setInitialLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const formFields = useAtomValue($fieldsArr)
  const navigate = useNavigate()
  const tableName = frontendTable.table_name
  const tableHeader = frontendTable?.table_config?.columnsMap || []
  const caption = frontendTable?.table_config?.caption || ''
  const viewBtn = frontendTable?.table_config?.actionsBtn.viewButton
  const editBtn = frontendTable?.table_config?.actionsBtn.editButton
  const head = frontendTable?.table_config?.actionsBtn.head

  let tblId = viewId
  if (viewId === 'new') {
    tblId = tableid
  }

  const handleInput = (e) => {
    const { value } = e.target
    setFrontendTable(prvSetting => create(prvSetting, drft => {
      drft.table_name = value
    }))
    setUpdateTblBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const handleSingleEntryView = (prop, val) => {
    setFrontendTable(prvSetting => create(prvSetting, drft => {
      assignNestedObj(drft, `single_entry_view_config->${prop}`, val)
    }))
    setUpdateTblBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const updateTable = () => {
    setIsLoading(true)
    const updatePromise = bitsFetch(frontendTable, 'bitforms_update_view')
      .then(res => {
        const { table } = res.data
        const data = {
          id: table.id,
          form_id: table.form_id,
          table_name: table.table_name,
          table_config: JSON.parse(table.table_config),
          table_styles: JSON.parse(table.table_styles),
          single_entry_view_config: JSON.parse(table.single_entry_view_config),
          access_control: JSON.parse(table.access_control),
        }
        setFrontendTable(data)
        setIsLoading(false)
        setUpdateTblBtn(prevState => ({ ...prevState, unsaved: false }))
        return res
      })
      .finally(() => setIsLoading(false))

    toast.promise(updatePromise, {
      loading: __('Updating...', 'biform'),
      success: (res) => res?.data?.message || res?.data,
      error: () => __('Error occurred, Please try again.'),
    })
  }

  useEffect(() => {
    if (viewId === 'new') {
      const newTableData = defaultTableSettings(formID, newTableId)
      bitsFetch(newTableData, 'bitforms_create_new_view')
        .then(res => {
          const { table } = res.data
          const data = {
            id: table.id,
            form_id: table.form_id,
            table_name: table.table_name,
            table_config: JSON.parse(table.table_config),
            table_styles: JSON.parse(table.table_styles),
            single_entry_view_config: JSON.parse(table.single_entry_view_config),
            access_control: JSON.parse(table.access_control),
          }
          setFrontendTable(data)
          setFrontendTables(prv => create(prv, drft => {
            drft = [...prv, table]
            return drft
          }))
          setTableId(newTableId)
          startTransition(() => navigate(`/form/settings/edit/${formID}/data-views/${newTableId}`, { replace: true }))
        }).catch(error => console.error(error))
      setInitialLoading(false)
    } else {
      const table = frontendTables.find(tbl => tbl.id === viewId)
      if (typeof table === 'undefined' && viewId !== 'new') {
        navigate(`/form/settings/edit/${formID}/data-views`, { replace: true })
      } else {
        setInitialLoading(false)
        const data = {
          id: table.id,
          form_id: table.form_id,
          table_name: table.table_name,
          table_config: JSON.parse(table.table_config),
          table_styles: JSON.parse(table.table_styles),
          single_entry_view_config: JSON.parse(table.single_entry_view_config),
          access_control: JSON.parse(table.access_control),
        }
        setFrontendTable(data)
      }
    }
    // setIsLoading(false)
  }, [viewId, formID])

  return (
    <>
      {initialLoading ? <Loader className={css({ flx: 'center', mt: '20%' })} />
        : (
          <div className={css(tblBldrStl.main)}>
            <div className={css(tblBldrStl.topBar)}>
              <div className={css({ flx: 'center-between', p: '5px 10px' })}>
                <Btn
                  className={`${css({ mr: 10 })}`}
                  onClick={() => navigate(`/form/settings/${formType}/${formID}/data-views`)}
                  size="sm"
                  variant="secondary-outline"
                >
                  <BackIcn className="mr-1" />
                  {__('View List', 'biform')}
                </Btn>
                <input
                  className={css(FieldStyle.input, { ml: 0, mt: 0, w: 300 })}
                  type="text"
                  aria-label="Table name"
                  placeholder="Table name"
                  value={tableName}
                  onChange={handleInput}
                />
                {/* <h3 className={css(tblBldrStl.toolTitle)}>{__('Table Settings')}</h3> */}
              </div>
              <div className={css(tblBldrStl.topSection)}>
                <CoolCopy
                  className={css({ mr: 17, w: 170 })}
                  cls={css(tblBldrStl.downmenuinput)}
                  value={`[bitform-view id='${viewId}']`}
                />
                <div className={css({ flx: 'align-center' })}>
                  <Btn
                    className={css({ mr: 10 })}
                    size="sm"
                    onClick={() => setSingleEntryModal(true)}
                  >
                    {__('Details Page', 'biform')}
                  </Btn>

                  <Btn
                    onClick={updateTable}
                    size="sm"
                    variant={updateTblBtn.unsaved ? 'primary' : 'disabled'}
                  >
                    {__('Update')}
                    {isLoading && <LoaderSm size={16} clr="#fff" className="ml-2" />}
                  </Btn>
                </div>
              </div>
            </div>
            <div className={css(tblBldrStl.mainContent)}>
              <div className={css(tblBldrStl.settingBar)}>
                <TableBuilderSettings />
              </div>
              <div className={css(tblBldrStl.bldr)}>
                <TableContents />
              </div>
            </div>
          </div>
        )}
      <Modal
        md
        autoHeight
        show={singleEntryModel}
        setModal={setSingleEntryModal}
        className="o-v"
        title={__('Details Page Styling', 'biform')}
        closeOnOutsideClick
      >
        <TinyMCE
          height="300px"
          id={`mail-tem-${formID}`}
          formFields={formFields}
          value={frontendTable?.single_entry_view_config?.body}
          onChangeHandler={(val) => handleSingleEntryView('body', val)}
          width="100%"
        />
      </Modal>

    </>

  )
}

const tblBldrStl = {
  topSection: {
    flx: 'center-between',
    p: '5px 10px',
  },
  topBar: {
    bb: '0.5px solid var(--white-0-83)',
    flx: 'between',
    fd: 'row',
  },
  toolTitle: {
    fw: 700,
    mt: 10,
    mb: 11,
  },
  downmenuinput: {
    w: '100% !important',
    fs: 12,
  },
  main: {
    dy: 'flex',
    fd: 'column',
    h: '100vh',
  },
  mainContent: {
    dy: 'flex',
    fd: 'row',
    h: '-webkit-fill-available',
  },
  settingBar: {
    w: '30%',
    br: '0.5px solid var(--white-0-83)',
  },

  bldr: {
    w: '70%',
    // p: 10,
  },
}

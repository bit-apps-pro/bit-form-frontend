import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { Fragment, useState } from 'react'
import { useFela } from 'react-fela'
import { $frontendTable, $updateTblBtn } from '../../GlobalStates/GlobalStates'
import { IS_PRO } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import FieldSettingsDivider from '../../components/CompSettings/CompSettingsUtils/FieldSettingsDivider'
import SimpleAccordion from '../../components/CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import { assignNestedObj } from '../../components/style-new/styleHelpers'
import useSWROnce from '../../hooks/useSWROnce'
import FieldStyle from '../../styles/FieldStyle.style'
import TableAndFieldMap from './TableAndFieldMap'

export default function TableSetting() {
  const { css } = useFela()
  // const { formID } = useParams()
  // const [icnMdl, setIcnMdl] = useState(false)
  // const [icnType, setIcnType] = useState('')
  const [pages, setPages] = useState([])
  const [frontendTable, setFrontendTable] = useAtom($frontendTable)
  const setUpdateTblBtn = useSetAtom($updateTblBtn)

  const tableTitl = frontendTable?.table_config?.caption || ''
  const editButton = frontendTable?.table_config?.actionsBtn.editButton || ''
  const viewButton = frontendTable?.table_config?.actionsBtn.viewButton || ''
  const head = frontendTable?.table_config?.actionsBtn.head || ''
  const columns = frontendTable?.table_config?.columnsMap

  useSWROnce('bitforms_get_all_wp_pages', {}, { fetchCondition: IS_PRO, onSuccess: data => setPages(data) })

  const handleInput = (path, value) => {
    setFrontendTable(prvSetting => create(prvSetting, drft => {
      assignNestedObj(drft, path, value)
    }))
    setUpdateTblBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  const hideEditButton = (path, checked) => {
    setFrontendTable(prvSetting => create(prvSetting, drft => {
      if (checked) {
        assignNestedObj(drft, path, true)
      } else {
        assignNestedObj(drft, path, false)
      }
    }))
    setUpdateTblBtn(prevState => ({ ...prevState, unsaved: true }))
  }

  return (
    <div className={css(settingStyle.main)}>
      <FieldSettingsDivider />
      <div className={css(settingStyle.caption)}>
        <span className={css(settingStyle.toolTitle, { w: 180 })}>{__('Table Caption')}</span>
        <input
          data-testid="nam-stng-inp"
          aria-label="Table Caption"
          placeholder="Table Caption"
          className={css(FieldStyle.input)}
          value={tableTitl}
          onChange={e => handleInput('table_config->caption', e.target.value)}
        />
      </div>
      <FieldSettingsDivider />
      <div className={css(settingStyle.section)}>
        <span className={css(settingStyle.toolTitle)}>{__('Column Mapping')}</span>
        <div className={css(settingStyle.fldMapRow)}>
          <div className={css(settingStyle.colMapTitleWrp)}>
            <span className={css(settingStyle.colMapTitle)}>{__('Column Header')}</span>
            <span className={css(settingStyle.colMapTitle)}>{__('Column Width')}</span>
            <span className={css(settingStyle.colMapTitle)}>{__('Form Field')}</span>
          </div>
        </div>
        <div className={css(settingStyle.fldMap)}>
          {columns?.map((clm, i) => (
            <Fragment key={`map-field-${i + 1}`}>
              <TableAndFieldMap
                index={i}
                clmItem={clm}
              />
            </Fragment>
          ))}
        </div>
      </div>

      <FieldSettingsDivider />
      <SimpleAccordion
        id="table-head-button"
        title={__('Action Column')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        tipProps={{ width: 250, icnSize: 17 }}
        toggleAction={({ target: { checked } }) => hideEditButton('table_config->actionsBtn->head->show', checked)}
        toggleChecked={head?.show}
        disable={!head?.show}
        open={head?.show}
      >
        <div className={css(FieldStyle.placeholder, settingStyle.headTitlSec)}>
          <div className={css(settingStyle.rowWrp)}>
            <span className={css(settingStyle.rowLabel)}>{__('Column Title')}</span>
            <input
              data-testid="Table=action-title-header"
              aria-label="Table action title header"
              placeholder="Table action title header"
              className={css(FieldStyle.input)}
              value={head.thead}
              onChange={e => handleInput('table_config->actionsBtn->head->thead', e.target.value)}
            />
          </div>
          <div className={css(settingStyle.rowWrp)}>
            <span className={css(settingStyle.rowLabel)}>{__('Column Width')}</span>
            <input
              data-testid="nam-stng-inp"
              aria-label="header width"
              placeholder="Header Width"
              className={css(FieldStyle.input)}
              value={head.w}
              onChange={e => handleInput('table_config->actionsBtn->head->w', e.target.value)}
            />
          </div>
        </div>
        <FieldSettingsDivider />
        <SimpleAccordion
          id="table-edit-button"
          title={__('Edit Button')}
          className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
          switching
          tipProps={{ width: 250, icnSize: 17 }}
          toggleAction={({ target: { checked } }) => hideEditButton('table_config->actionsBtn->editButton->show', checked)}
          toggleChecked={editButton?.show}
          disable={!editButton?.show}
          open={editButton?.show}
        >
          <div className={css(FieldStyle.placeholder)}>
            <div className={css(settingStyle.rowWrp)}>
              <span className={css(settingStyle.rowLabel)}>{__('Redirect Page')}</span>
              <select
                aria-label="Redirect page for redirect"
                className={css(FieldStyle.input)}
                value={editButton.slug}
                onChange={e => handleInput('table_config->actionsBtn->editButton->slug', e.target.value)}
                name=""
                id="edit"
                data-testid="edit-button-slug"
              >
                <option value="custom">{__('Custom Page')}</option>
                {pages && pages.map((urlDetail, ind) => (
                  <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
                ))}
              </select>
            </div>
            <div className={css(settingStyle.rowWrp)}>
              <span className={css(settingStyle.rowLabel)}>Redirect Link</span>
              <input
                data-testid="edit-button-slug-txt"
                aria-label="Edit button slug"
                placeholder="Edit button slug"
                className={css(FieldStyle.input, { mb: 5 })}
                value={editButton.slug}
                onChange={e => handleInput('table_config->actionsBtn->editButton->slug', e.target.value)}
              />
            </div>
            <div className={css(settingStyle.rowWrp)}>
              <span className={css(settingStyle.rowLabel)}>Button Text</span>
              <input
                data-testid="edit-button-txt"
                aria-label="Edit button text"
                placeholder="Edit button text"
                className={css(FieldStyle.input)}
                value={editButton.btnTxt}
                onChange={e => handleInput('table_config->actionsBtn->editButton->btnTxt', e.target.value)}
              />
            </div>
          </div>
        </SimpleAccordion>
        <FieldSettingsDivider />
        <SimpleAccordion
          id="table-view-button"
          title={__('View Button')}
          className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
          switching
          tipProps={{ width: 250, icnSize: 17 }}
          toggleAction={({ target: { checked } }) => hideEditButton('table_config->actionsBtn->viewButton->show', checked)}
          toggleChecked={viewButton.show}
          open={viewButton.show}
          disable={!viewButton?.show}
        >
          <div className={css(FieldStyle.placeholder)}>
            <div className={css(settingStyle.rowWrp)}>
              <span className={css(settingStyle.rowLabel)}>{__('Redirect Page')}</span>
              <select
                aria-label="Redirect page for redirect"
                className={css(FieldStyle.input)}
                value={viewButton.slug}
                onChange={e => handleInput('table_config->actionsBtn->viewButton->slug', e.target.value)}
                name=""
                id="edit"
                data-testid="edit-button-slug"
              >
                <option value="custom">{__('Custom Page')}</option>
                {pages && pages.map((urlDetail, ind) => (
                  <option key={`r-url-${ind + 22}`} value={urlDetail.url}>{urlDetail.title}</option>
                ))}
              </select>
            </div>
            <div className={css(settingStyle.rowWrp)}>

              <span className={css(settingStyle.rowLabel)}>{__('Redirect Link')}</span>
              <input
                data-testid="view-button-slug"
                aria-label="View button slug"
                placeholder="View button slug"
                className={css(FieldStyle.input)}
                value={viewButton.slug}
                onChange={e => handleInput('table_config->actionsBtn->viewButton->slug', e.target.value)}
              />
            </div>
            <div className={css(settingStyle.rowWrp)}>
              <span className={css(settingStyle.rowLabel)}>{__('Button Text')}</span>
              <input
                data-testid="view-button-txt"
                aria-label="View button Text"
                placeholder="View button Text"
                className={css(FieldStyle.input)}
                value={viewButton.btnTxt}
                onChange={e => handleInput('table_config->actionsBtn->viewButton->btnTxt', e.target.value)}
              />
            </div>
          </div>
        </SimpleAccordion>
      </SimpleAccordion>

      <FieldSettingsDivider />
    </div>
  )
}

const settingStyle = {
  main: {
    mxh: '73vh',
    owy: 'auto',
  },
  titleSec: {
    flx: 'center-between',
  },
  section: {
    p: 10,
  },
  caption: {
    flx: 'jc',
    p: '5px 10px',
  },
  fldMap: {
    pl: 8,
  },

  toolTitle: {
    fw: 700,
    my: 10,
    pb: 5,
    pt: 5,
    pl: 5,
  },
  fldMapRow: {
    flx: 'center-between',
    gp: 10,
    pl: 8,
  },
  downmenuinput: {
    w: '100% !important',
    fs: 12,
  },
  rowWrp: {
    flx: 'between',
    ai: 'center',
  },
  rowLabel: {
    w: 155,
    mt: 5,
    fw: 400,
  },
  colMapTitleWrp: {
    w: '100%',
    fw: 400,
    mt: 10,
    p: '0px 5px',
  },
  colMapTitle: {
    w: '32%',
    dy: 'inline-block',
  },
  headTitlSec: {
    mx: 14,
    mb: 15,
  },
  headTitl: {
    mt: 10,
    fw: 500,
  },
}

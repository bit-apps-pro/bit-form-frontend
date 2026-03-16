import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { $viewId } from '../../GlobalStates/GlobalStates'
import { __ } from '../../Utils/i18nwrap'
import Icons from '../../components/CompSettings/Icons'
import Modal from '../../components/Utilities/Modal'
import StyleSetting from './StyleSetting'
import TableSetting from './TableSetting'

export default function TableBuilderSettings() {
  const { css } = useFela()
  const { formID, viewId } = useParams()
  const tableid = useAtomValue($viewId)
  const [icnMdl, setIcnMdl] = useState(false)
  const [icnType, setIcnType] = useState('')

  return (
    <>
      <Tabs selectedTabClassName="s-t-l-active">
        <TabList className="flx m-0">
          <Tab className="btcd-s-tab-link">
            <b>{__('Setting')}</b>
          </Tab>
          <Tab className="btcd-s-tab-link">
            <b>{__('Style')}</b>
          </Tab>
          {/* <Tab className="btcd-s-tab-link">
            <b>{__('Access Control')}</b>
          </Tab> */}
        </TabList>
        <TabPanel>
          <TableSetting />
        </TabPanel>
        <TabPanel>
          <StyleSetting />
        </TabPanel>
        {/* <TabPanel>
          <TableAccessControl />
        </TabPanel> */}
      </Tabs>

      <Modal
        md
        autoHeight
        show={icnMdl}
        setModal={setIcnMdl}
        className="o-v"
        title={__('Icons')}
      >
        <div className="pos-rel" />
        <Icons iconType={icnType} setModal={setIcnMdl} />
      </Modal>
    </>
  )
}

const settingStyle = {
  titleSec: {
    flx: 'center-between',
    bb: '0.5px solid var(--white-0-83)',
  },
  clmMapSection: {
    p: 10,
  },
  fldMap: {
    pl: 8,
    mxh: 200,
    owy: 'scroll',
  },

  toolTitle: {
    fw: 700,
    mt: 10,
    mb: 11,
    pb: 5,
    pt: 5,
    pl: 10,
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
  rowTitle: {
    flx: 'center-between',
    gp: 24,
    fw: 400,
    mt: 10,
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

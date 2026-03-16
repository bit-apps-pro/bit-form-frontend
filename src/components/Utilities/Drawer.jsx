import CloseIcn from '../../Icons/CloseIcn'
import DocIcn from '../../Icons/DocIcn'
import InfoIcn from '../../Icons/InfoIcn'
import TrashIcn from '../../Icons/TrashIcn'

function Drawer(props) {
  return (
    <div className="btcd-drawer" style={{ right: props.show ? 0 : -620, width: 600 }}>
      <div className="flx flx-between">
        <div className="btcd-drawer-title">{props.title}</div>
        <div className="flx">
          <button onClick={props.relatedinfo} className="icn-btn btcd-icn-lg tooltip" style={{ '--tooltip-txt': '"Related Info"' }} aria-label="icon-btn" type="button">
            <InfoIcn size="15" />
          </button>
          <button onClick={props.editData} className="icn-btn btcd-icn-lg tooltip" style={{ '--tooltip-txt': '"Edit"' }} aria-label="icon-btn" type="button">
            <DocIcn size="15" />
          </button>
          <button onClick={props.delConfMdl} className="icn-btn btcd-icn-lg tooltip" style={{ '--tooltip-txt': '"Delete"' }} aria-label="icon-btn" type="button">
            {/* <span className="btcd-icn icn-trash-fill" style={{ fontSize: 16 }} /> */}
            <TrashIcn size="15" />
          </button>
          <button onClick={() => props.close(false)} className="icn-btn btcd-icn-lg tooltip" style={{ '--tooltip-txt': '"Close"' }} aria-label="modal-close" type="button">
            <CloseIcn size="14" stroke="3" />
          </button>
        </div>
      </div>
      <small className="btcd-mdl-subtitle">{props.subTitle}</small>
      <div className="btcd-mdl-div" />
      {props.children}
    </div>
  )
}

export default Drawer

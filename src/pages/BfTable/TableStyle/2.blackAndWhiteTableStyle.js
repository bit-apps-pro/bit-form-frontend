export default function blackAndWhiteTableStyles({ formID, tblID }) {
  return {
    [`.bf${formID}-${tblID}-tbl-wrp`]: {
      'overflow-x': 'auto',
    },

    [`.bf${formID}-${tblID}-tbl-wrp::-webkit-scrollbar`]: {
      height: '8px',
    },

    [`.bf${formID}-${tblID}-tbl-wrp::-webkit-scrollbar-thumb`]: {
      background: '#1b4965',
      'border-radius': '40px',
    },

    [`.bf${formID}-${tblID}-tbl-wrp::-webkit-scrollbar-track`]: {
      background: '#fff',
      'border-radius': '40px',
    },

    [`.bf${formID}-${tblID}-tbl`]: {
      'border-collapse': 'collapse',
      'text-align': 'center',
      width: '100%',
    },

    [`.bf${formID}-${tblID}-tbl-caption`]: {
      'font-size': '20px',
      padding: '20px',
      'font-weight': 700,
    },

    [`.bf${formID}-${tblID}-tbl th,.bf${formID}-${tblID}-tbl td`]: {
      padding: '10px',
      // width: '75px',
      border: '1px solid #e5e5e5',
    },

    [`.bf${formID}-${tblID}-thead`]: {
      color: '#5e5e5e',
      /* background: #006aff, */
      background: '#d7e6fb',
    },

    [`.bf${formID}-${tblID}-tbody tr:nth-of-type(even)>*`]: {
      background: '#f3f3f3',
    },

    [`.bf${formID}-${tblID}-tbody tr:nth-of-type(odd)>*`]: {
      background: '#ffffff',
    },

    [`.bf${formID}-${tblID}-tbl-edit-btn`]: {
      color: '#fff',
      'background-color': '#9f9f9f',
      'font-weight': 400,
      'text-align': 'center',
      border: '1px solid #9f9f9f',
      padding: '5px 12px',
      'font-size': '1rem',
      'line-height': 1.5,
      transition: 'border .15s ease-in-out, box-shadow .15s ease-in-out, background-color .15s ease-in-out',
      cursor: 'pointer',
      margin: '5px',
      'text-decoration': 'none',
    },

    [`.bf${formID}-${tblID}-tbl-edit-btn:hover`]: {
      color: '#fff',
      'background-color': ' #bebdbd',
      'border-color': ' #9f9f9f',
    },

    [`.bf${formID}-${tblID}-tbl-edit-btn:focus-visible`]: {
      outline: 0,
      'box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },

    /* button on focus */
    [`.bf${formID}-${tblID}-tbl-edit-btn:focus`]: {
      'box-shadow': '0 0 0 0.2rem rgba(114, 114, 114, 0.25)',
      outline: 0,
    },

    [`.bf${formID}-${tblID}-tbl-view-btn`]: {
      color: '#fff',
      'background-color': '#9f9f9f',
      'font-weight': 400,
      'text-align': 'center',
      border: '1px solid #9f9f9f',
      padding: '5px 12px',
      'font-size': '1rem',
      'line-height': 1.5,
      transition: 'border .15s ease-in-out, box-shadow .15s ease-in-out, background-color .15s ease-in-out',
      cursor: 'pointer',
      margin: '5px',
      'text-decoration': 'none',
    },

    [`.bf${formID}-${tblID}-tbl-view-btn:hover`]: {
      color: '#fff',
      'background-color': ' #bebdbd',
      'border-color': ' #9f9f9f',
    },

    [`.bf${formID}-${tblID}-tbl-view-btn:focus-visible`]: {
      outline: 0,
      'box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },

    [`.bf${formID}-${tblID}-tbl-view-btn:focus`]: {
      'box-shadow': '0 0 0 0.2rem rgba(114, 114, 114, 0.25)',
      outline: 0,
    },
  }
}

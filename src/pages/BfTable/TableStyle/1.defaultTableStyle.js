export default function defaultTableStyles({ formID, tblID }) {
  return {
    [`.bf${formID}-${tblID}-tbl-wrp`]: {
      padding: '10px',
      color: '#525252',
      'font-family': 'sans-serif',
    },

    [`.bf${formID}-${tblID}-tbl-cntnr`]: {
      width: '100%',
      'overflow-x': 'scroll',
    },

    [`.bf${formID}-${tblID}-tbl`]: {
      'overflow-x': 'auto',
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': '#e5e5e5',
      'border-radius': '8px',
      'border-collapse': 'separate',
      'border-spacing': 0,
      width: '100%',
    },

    [`.bf${formID}-${tblID}-tbl::-webkit-scrollbar`]: {
      height: '8px',
    },

    [`.bf${formID}-${tblID}-tbl::-webkit-scrollbar-thumb`]: {
      background: ' #007bff',
      'border-radius': '40px',
    },

    [`.bf${formID}-${tblID}-tbl::-webkit-scrollbar-track`]: {
      background: '#ffffff',
      'border-radius': '40px',
    },

    [`.bf${formID}-${tblID}-tbl-caption`]: {
      'font-size': '20px',
      padding: '20px',
      'font-weight': 700,
      'text-align': 'center',
    },

    [`.bf${formID}-${tblID}-tbl tr`]: {
    },

    [`.bf${formID}-${tblID}-tbl tr:hover`]: {
      background: '#eef4fb',
    },

    [`.bf${formID}-${tblID}-tbl tr:nth-child(even)`]: {
      background: '#eef4fb',
    },
    [`.bf${formID}-${tblID}-tbl tr:nth-child(odd)`]: {
      // background: '#eef4fb',
    },

    [`.bf${formID}-${tblID}-tbl tr:last-child td`]: {
      'border-bottom': 'none',
    },

    [`.bf${formID}-${tblID}-tbl th,.bf${formID}-${tblID}-tbl td`]: {
      padding: '10px',
      // width: '75px',
      'border-bottom': '1px solid #e5e5e5',
    },

    [`.bf${formID}-${tblID}-thead`]: {
      color: '#5e5e5e',
      /* background: #006aff, */
      // background: '#d7e6fb',
    },

    [`.bf${formID}-${tblID}-tbl-edit-btn`]: {
      color: '#fff',
      'background-color': '#007bff',
      'border-color': '#007bff',
      'font-weight': 400,
      'text-align': 'center',
      'border-style': 'solid',
      'border-width': '1px',
      padding: '5px 12px',
      'font-size': '1rem',
      'border-radius': '5px',
      transition: 'color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out',
      cursor: 'pointer',
      'text-decoration': 'none',
    },

    [`.bf${formID}-${tblID}-tbl-edit-btn:hover`]: {
      color: '#fff !important',
      'background-color': '#0069d9',
      'border-color': '#0062cc',
    },

    [`.bf${formID}-${tblID}-tbl-edit-btn:focus-visible`]: {
      outline: 0,
      'box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },

    [`.bf${formID}-${tblID}-tbl-edit-btn:focus`]: {
      outline: 0,
      'box-shadow': ' 0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },

    [`.bf${formID}-${tblID}-tbl-view-btn`]: {
      color: '#fff',
      'background-color': '#007bff',
      'border-color': '#007bff',
      'font-weight': 400,
      'text-align': 'center',
      'border-style': 'solid',
      'border-width': '1px',
      padding: '5px 12px',
      'font-size': '1rem',
      'border-radius': '5px',
      transition: 'color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out',
      cursor: 'pointer',
      'text-decoration': 'none',
    },

    [`.bf${formID}-${tblID}-tbl-view-btn:hover`]: {
      color: '#ffffff !important',
      'background-color': '#0069d9',
      'border-color': '#0062cc',
    },

    [`.bf${formID}-${tblID}-tbl-view-btn:focus-visible`]: {
      outline: 0,
      'box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },

    [`.bf${formID}-${tblID}-tbl-view-btn:focus`]: {
      outline: 0,
      'box-shadow': ' 0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },

    [`.bf${formID}-${tblID}-tbl-top-bar`]: {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'end',
      'font-size': '1rem',
      margin: '0 0 10px 0',
    },

    [`.bf${formID}-${tblID}-tbl-action-btns`]: {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'end',
      gap: '10px',
    },

    [`.bf${formID}-${tblID}-tbl-pgn-slt`]: {
      padding: '4px 10px',
      'border-color': '#ebebeb',
      'border-width': '1px',
      'border-style': 'solid',
      width: '74px',
      height: '34px',
      'background-color': '#ffffff',
      transition: 'box-shadow .15s ease-in-out',
      'font-size': '16px',
      color: '#525252',
      'border-radius': '23px',
    },

    /* select on focus */
    [`.bf${formID}-${tblID}-tbl-pgn-slt:focus`]: {
      outline: 0,
      'box-shadow': '0 0 0 0.1px hsla(215, 100%, 50%, 100%)',
      'border-color': 'hsla(215, 100%, 50%, 100%)',
    },

    [`.bf${formID}-${tblID}-tbl-pgn-slt:focus-visible`]: {
      outline: 0,
      'box-shadow': '0 0 0 0.1px hsla(215, 100%, 50%, 100%)',
      'border-color': 'hsla(215, 100%, 50%, 100%)',
    },

    [`.bf${formID}-${tblID}-serc-bx`]: {
      border: '1px solid #e6e6e6',
      width: '150px',
      'border-radius': '3px',
      height: '29px',
      background: '#ffffff',
      transition: 'box-shadow 0.3s ease 0s',
      padding: '0px 5px',
      'font-size': '16px',
      color: '#525252',
    },

    [`.bf${formID}-${tblID}-serc-bx:focus`]: {
      outline: 0,
      'box-shadow': '0 0 0 0.1px hsla(215, 100%, 50%, 100%)',
      'border-color': 'hsla(215, 100%, 50%, 100%)',
    },

    [`.bf${formID}-${tblID}-serc-bx:focus-visible`]: {
      outline: 0,
      'box-shadow': '0 0 0 0.1px hsla(215, 100%, 50%, 100%)',
      'border-color': 'hsla(215, 100%, 50%, 100%)',
    },

    [`.bf${formID}-${tblID}-tbl-footer`]: {
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'margin-top': '10px',
      color: '#525252',
    },

    [`.bf${formID}-${tblID}-pgn-btn`]: {
      'background-color': '#ffffff',
      color: '#525252',
      'font-weight': 400,
      'text-align': 'center',
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': '#e7ecf2',
      padding: '5px 10px',
      'font-size': '1rem',
      'border-radius': '50%',
      transition: 'color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out',
      cursor: 'pointer',
      margin: '0 3px',
    },

    [`.bf${formID}-${tblID}-pgn-btn:hover`]: {
      'background-color': '#f1f1f1',
      'border-color': '#f1f1f1',
    },

    [`.bf${formID}-${tblID}-pgn-btn:focus-visible`]: {
      outline: 0,
      'box-shadow': '0 0 0 0.15rem hsla(211, 95%, 85%, 0.25)',
    },

    [`.bf${formID}-${tblID}-pgn-btn:focus`]: {
      outline: 0,
      'box-shadow': '0 0 0 0.15rem hsla(211, 95%, 85%, 0.25)',
    },

    [`.bf${formID}-${tblID}-pgn-btn:disable`]: {
      'background-color': '#dddcdc',
      'border-color': '#f1f1f1',
      color: '#b5acac',
    },
  }
}

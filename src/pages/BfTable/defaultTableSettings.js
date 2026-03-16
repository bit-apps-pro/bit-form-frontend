import defaultTableStyles from './TableStyle/1.defaultTableStyle'

const defaultTableSettings = (formID, newTableId) => ({
  id: newTableId,
  form_id: formID,
  table_name: 'Untitle View',
  access_control: {},
  table_config: {
    caption: 'Bitform Table View',
    columnsMap: [
      {
        thead: 'header name',
        fk: '',
        w: '10%',
      },
    ],
    actionsBtn: {
      head: {
        thead: 'Action',
        w: '10%',
        show: true,
      },
      editButton: {
        btnTxt: 'Edit',
        slug: '',
        show: true,
        preIcn: '',
        sufIcn: '',
      },
      viewButton: {
        btnTxt: 'View',
        slug: '',
        show: true,
        preIcn: '',
        sufIcn: '',
      },
    },
  },
  table_styles: {
    theme: 'bitform',
    style: defaultTableStyles({ tblID: newTableId, formID }),
  },
  single_entry_view_config: {
    show: true,
    style: '',
    js: '',
    body: '<p>Single Entry View</p>\n <a href="{back_to_view}">◀Back</a>',
  },
})

export default defaultTableSettings

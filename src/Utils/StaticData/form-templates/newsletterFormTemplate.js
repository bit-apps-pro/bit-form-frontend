export default {
  name: 'News Letter Form',
  theme: 'bitformDefault',
  formInfo: {
    formName: 'News Letter Form',
  },
  fields: {
    'fld_key-1': {
      typ: 'button',
      btnSiz: 'md',
      btnTyp: 'submit',
      txt: 'Subscribe',
      icn: {
        pos: '',
        url: '',
      },
      valid: {},
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-1',
      fulW: true,
    },
    'fld_key-2': {
      typ: 'email',
      ph: 'Enter your email here',
      phHide: true,
      pattern: '^[^$_bf_$s@]+@[^$_bf_$s@]+$_bf_$.[^$_bf_$s@]+$',
      valid: {
        hideLbl: true,
        req: true,
        reqShow: true,
        reqPos: 'after',
      },
      err: {
        invalid: {
          dflt: '<p style="margin:0">Please, Enter a valid email address.</p>',
          show: true,
        },
        req: {
          dflt: '<p style="margin:0">This field is required</p>',
          show: true,
          custom: true,
          msg: '<p style="margin:0">Please enter your email.</p>',
        },
      },
      customClasses: {},
      customAttributes: {},
      fieldName: 'fld_key-2',
      acHide: true,
      ac: 'email',
    },
  },
  layouts: {
    lg: [
      {
        w: 45,
        h: 54,
        x: 0,
        y: 0,
        i: 'fld_key-2',
      },
      {
        w: 13,
        h: 54,
        x: 45,
        y: 0,
        i: 'fld_key-1',
      },
    ],
    md: [],
    sm: [],
  },

}

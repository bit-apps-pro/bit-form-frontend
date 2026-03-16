export default {
  name: 'Contact Form',
  theme: 'bitformDefault',
  formInfo: {
    formName: 'Contact Form',
  },
  fields: {
    'fld_key-1': {
      typ: 'button',
      btnSiz: 'md',
      btnTyp: 'submit',
      txt: 'Submit',
      icn: {
        pos: '',
        url: '',
      },
      valid: {},
      customClasses: {},
      customAttributes: {},
      fulW: true,
    },
    'fld_key-2': {
      typ: 'text',
      lbl: 'Name',
      phHide: true,
      valid: {
        req: true,
        reqPos: 'after',
        reqShow: true,
      },
      err: {
        req: {
          dflt: '<p style="margin:0">This field is required</p>',
          show: true,
        },
      },
      customClasses: {},
      customAttributes: {},
      fieldName: 'name',
      acHide: true,
      ac: 'name',
      ph: 'John Doe',
    },
    'fld_key-3': {
      typ: 'textarea',
      lbl: 'Message',
      phHide: true,
      valid: {
        req: true,
        reqPos: 'after',
        reqShow: true,
      },
      err: {
        req: {
          dflt: '<p style="margin:0">This field is required</p>',
          show: true,
          custom: true,
          msg: '<p style="margin:0">Message can not be empty.</p>',
        },
      },
      customClasses: {},
      customAttributes: {},
      fieldName: 'textarea-44-3',
      ph: 'Write your message...',
    },
    'fld_key-5': {
      typ: 'email',
      lbl: 'Email',
      ph: 'example@mail.com',
      phHide: true,
      pattern: '^[^$_bf_$s@]+@[^$_bf_$s@]+$_bf_$.[^$_bf_$s@]+$',
      valid: {
        req: true,
        reqPos: 'after',
        reqShow: true,
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
      fieldName: 'email',
      acHide: true,
      ac: 'email',
    },
  },
  layouts: {
    lg: [
      {
        w: 60,
        h: 77,
        x: 0,
        y: 0,
        i: 'fld_key-2',
      },
      {
        w: 60,
        h: 77,
        x: 0,
        y: 77,
        i: 'fld_key-5',
      },
      {
        w: 60,
        h: 98,
        x: 0,
        y: 154,
        i: 'fld_key-3',
        minW: 9,
      },
      {
        w: 60,
        h: 50,
        x: 0,
        y: 252,
        i: 'fld_key-1',
      },
    ],
    md: [],
    sm: [],
  },

}

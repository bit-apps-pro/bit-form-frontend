const themeCustomizeStyles = {
  addItemBtn: {
    // se: 25,
    // b: 'none',
    cr: 'var(--bf-text-clr-dark)',
    mt: 'var(--bf-space-5)',
    b: '1px solid var(--bf-stroke-clr)',
    // brs: '50%',
    brs: 'var(--bf-bdr-radius-md)',
    p: '5px 10px',
    flxi: 'center',
    gp: 'var(--bf-space-4)',
    bd: 'var(--white-0-95)',
    curp: 1,
    tn: 'transform 0.2s',
    ':hover': {
      // tm: 'scale(1.1)',
      // cr: 'var(--b-50)',
      bd: 'var(--bf-bg-tertiary)',
      cr: 'var(--bf-text-clr-white)',
      fw: 'var(--bf-font-medium)',
    },
    ':focus-within': {
      // focusShadow: 1,
      bd: 'var(--bf-bg-tertiary)',
      cr: 'var(--bf-text-clr-white)',
      fw: 'var(--bf-font-medium)',
    },
    ':active': { tm: 'scale(0.95)' },
  },
}

export default themeCustomizeStyles

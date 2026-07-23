
const styleLayersStyles = {
  con: {
    h: '100%',
    bs: '0 0 0 1px var(--b-44-87)',
    ow: 'hidden',
  },
  title: {
    fs: 18,
    fw: 600,
    mt: 5,
    px: 16,
  },
  themeQuickTweaks: {
    w: 'auto',
    // fs: 'var(--bf-font-base)',
    fs: 'var(--bf-font-semibase)',
    fw: 'var(--bf-font-medium)',
    brs: 'var(--bf-bdr-radius-sm)',
    m: '15px 10px',
    p: 'var(--bf-space-3) 5px !important',
    h: 'auto !important',
    '&.active': {
      bs: '0 0 0 1px var(--bf-tertiary-300)',
    },
  },
  divider: {
    bb: '1px solid var(--white-0-83)',
  },
  scrollDiv: {
    px: 8,
    py: 8,
    ow: 'hidden',
    mb: 300
  },
  sectionAccordion: {
    '& .btgl': {
      curp: 1,
      p: 'var(--bf-space-5) 15px !important',
      fs: 'var(--bf-font-base) !important',
      bb: '1px solid var(--bf-stroke-clr)',
    },
    '& .body': {
      p: '10px',
      gp: 'var(--bf-space-2)',
      dy: 'flex',
      fd: 'column',
    },
  },
  layerAccordion: {
    brs: 'var(--bf-bdr-radius-sm)',
    '& .btgl-wrapper': {
      brs: 'var(--bf-bdr-radius-sm)',
    },
    '& .title-bar': {
      p: '3px 10px',
      brs: 'var(--bf-bdr-radius-sm)',
    },
    '& .title': {
      // fs: 'var(--bf-font-md)',
      fs: 'var(--bf-font-base)',
    },
    '& .toggle-icn-wrapper': {
      ml: '-15px',
      cr: 'var(--b-189-67)',
    },
    '& .body': {
      pn: 'relative',
      pl: 'var(--bf-space-4)',
      '&::before': {
        content: '""',
        pn: 'absolute',
        lt: 'var(--bf-space-4)',
        tp: 10,
        h: 'calc(100% - 20px)',
        bl: '1px solid var(--bf-stroke-clr)',
      },
    },
    '&.has-children .body': {
      pl: 'var(--bf-space-6)',
    },
  },
  simpleNavBtn: {
    brs: 'var(--bf-bdr-radius-sm)',
    fs: 'var(--bf-font-md)',
    p: '7px 10px',
    h: 'auto',
    '&.active': {
      bs: '0 0 0 1px var(--bf-tertiary-300)',
      fw: 'var(--bf-font-medium)',
    },
  },
  sectionGroup: {
    mb: 24,
  },
  groupHeader: {
    fs: 12,
    fw: 600,
    tt: 'uppercase',
    cr: 'var(--b-50)',
    ls: '0.5px',
    mb: 8,
    px: 8,
    py: 4,
  },
  navItem: (level: number, isActive?: boolean) => ({
    d: 'flex',
    ai: 'center',
    jc: 'space-between',
    px: 8 + (level * 16),
    py: 8,
    cr: isActive ? 'var(--b-79-96)' : 'var(--b-79-96)',
    bg: isActive ? 'var(--b-14-100-61)' : 'transparent',
    br: 6,
    cur: 'pointer',
    fs: 13,
    ':hover': {
      bg: 'var(--b-14-100-95)',
    },
    transition: 'all 0.2s ease',
  }),
  navItemLeft: {
    d: 'flex',
    ai: 'center',
    gap: 8,
  },
  navItemLabel: {
    cr: 'var(--b-79-96)',
  },
  badge: {
    fs: 10,
    fw: 500,
    cr: 'var(--b-50)',
    bg: 'var(--b-14-100-93)',
    px: 6,
    py: 2,
    br: 4,
    tt: 'uppercase',
  },
  fieldElements: {
    // Container for field-specific elements
  },
}

export default styleLayersStyles
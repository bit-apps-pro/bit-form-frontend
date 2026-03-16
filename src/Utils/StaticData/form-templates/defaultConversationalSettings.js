export default function defaultConversationalSettings(formId) {
  return {
    enable: false,
    stepListObject: {
      allSteps: {
        layout: 'normal-layout',
        background: {
          'background-color': 'transparent',
        },
        btnTxt: 'Skip',
        nextBtnTxt: 'Next',
        stepHints: 'Press <b>Enter ↵</b>',
        buttonColor: '#3f51b5',
        buttonBgColor: `var(--bc${formId}-a-clr)`,
        buttonTextColor: 'hsla(0, 0%, 100%, 1)',
        buttonIconFilter: 'invert(1)',
      },
      welcomePage: {
        enable: true,
        title: 'Welcome to Conversation Form!',
        content: '<h4 style="text-align: center;">How can we help you?</h4>',
        btnTxt: 'Start',
      },
    },
    themeSettings: {
      themeStyle: 'default',
      accentColor: 'hsla(217, 100%, 50%, 100%)',
      background: {
        'background-color': 'hsla(0, 0%, 100%, 1)',
      },
      labelTextColor: 'hsla(0, 0%, 0%, 1)',
      inputTextColor: 'hsla(0, 0%, 0%, 1)',
      fontSize: '1rem',
      fontFamily: 'Roboto',
      border: {
        'border-style': 'solid',
        'border-color': 'hsla(0, 0%, 0%, 1)',
        'border-width': '1px',
        'border-radius': '8px',
      },
    },
    navigationSettings: {
      show: true,
      position: 'top',
      alignment: 'left',
      type: 'bar',
      showProgressLabel: true,
      progressLabel: '${bc-percent}% (${bc-step}/${bc-total-steps}) completed',
      showProgressBar: true,
      showNavigateBtn: true,
      showBranding: false,
    },
  }
}

const changelogInfo = {
  '2.2.0': {
    date: '15-July-2023',
    changes: {
      added: {
        label: 'Added',
        list: [
          {
            label: 'New Field',
            tag: 'new',
            list: [
              'Repeater Field - to create repeated forms with complex conditional logics calculation',
            ],
          },
          {
            label: 'Features',
            list: [
              {
                label: 'Form Abandonment or Partial Form Submission',
                tag: 'new',
              },
              {
                label: 'Pdf Attachment of Form Entry in Email Notifications',
                tag: 'new',
              },
            ],
          },
        ],
      },
      fixed: {
        label: 'Fixed',
        list: [
          'Form entry edit route 404 issue',
          "Forms not initializing on Elementor page builder's modal",
        ],
      },
    },
  },

  '2.14.0': {
    date: '17th September 2024',
    changes: {
      added: {
        label: 'Added',
        list: [
          {
            label: 'Form Templates',
            tag: 'new',
            list: [
              'New Form Templates: Added 24+ new form templates to simplify form creation',
            ],
          },
        ],
      },
      imporovement: {
        label: 'Improvement',
        list: [
          'Implemented support for sending images or signatures directly to a Telegram channel',
        ],
      },
      coming: {
        label: <b>Coming Soon</b>,
        list: [
          'Frontend Entry View, Edit & Delete (CRUD).',
        ],
      },
    },
  },
  '2.15.0': {
    date: '29 September, 2024',
    changes: {
      added: {
        label: 'Added',
        list: [
          {
            label: (<b>Frontend entry view & edit</b>),
            tag: 'new',
            list: [
              'Added the ability to view and logged in user to edit form entries.',
            ],
          },
        ],
      },
      imporovement: {
        label: 'Improvement',
        list: [
          'Add new admin side bar menu & top bar menu for bit form.',
        ],
      },
      coming: {
        label: <b>Coming Soon</b>,
        list: [
          'Better UI/UX Improvements',
        ],
      },
    },
  },
  '2.20.0': {
    date: '20 June, 2025',
    changes: {
      added: {
        label: 'Added',
        list: [
          {
            label: (<b>Advanced Date Time Field</b>),
            tag: 'new',
            list: [
              'Advanced Date-Time Field: Introduced a new field type that lets users select both date and time, improving form flexibility and user experience.',
            ],
          },
          'New Smart Tags (Functions): Added ${_bf_datetime_difference()} and ${_bf_add_subtract_datetime()} smart tags to support date and time calculations.',
          'New Conditional Action: Added a "Config Option" action in conditional logic to dynamically change Date-Time field config based on user input.',
        ],
      },
      imporovement: {
        label: 'Improvement',
        list: [
          'Enhanced Logic for Date/Time Fields: Improved conditional logic support for Date, Time, Week, and Month fields, enabling more advanced scenarios.',
        ],
      },
      coming: {
        label: <b>In Progress</b>,
        list: [
          {
            label: (<b>Better UI/UX Improvements</b>),
            list: [
              'separating basic and advanced field settings for a cleaner UI and more intuitive experience.',
            ],
          },
        ],
      },
    },
  },
  '2.21.0': {
    date: '23 October, 2025',
    changes: {
      added: {
        label: 'Added',
        list: [
          {
            label: (<b>Razorpay Webhook Support</b>),
            tag: 'new',
            list: [
              'Added webhook support for Razorpay payments after form submission.',
            ],
          },
          {
            label: (<b>Stripe MB Way Payment Method</b>),
            tag: 'new',
            list: [
              'Added MB Way payment method for Stripe.',
            ],
          },
        ],
      },
      imporovement: {
        label: 'Improvement',
        list: [
          'Routing: Optimized AJAX routing for improved performance.',
          'MailChimp Integration: Enhanced birthdate field mapping for better compatibility.',
          'Payment Information: Refined payment details display within the entry details section.',
          'Smart Tags: Improved Smart Tag handling in integration field mappings.',
        ],
      },
      coming: {
        label: <b>In Progress</b>,
        list: [
          {
            label: (<b>Better UI/UX Improvements</b>),
            list: [
              'separating basic and advanced field settings for a cleaner UI and more intuitive experience.',
            ],
          },
        ],
      },
    },
  },
  '2.10.0': {
    date: '12 February, 2024',
    changes: {
      added: {
        label: 'Added',
        list: [
          {
            label: (<b>Conversational Form</b>),
            tag: 'new',
            list: [
              'Easily convert your standard forms into conversational experiences with just one click',
            ],
          },
        ],
      },
      imporovement: {
        label: 'Improvement',
        list: [
          'Added missing functionality to automatically populate placeholders based on conditional logic onload.',
          'Included missing Smart Tags (such as calc and count) in PHP.',
          'Enabled workflow actions triggered upon form submission via API.',
        ],
      },
      fixed: {
        label: 'Fixed',
        list: [
          'Resolved issue with previous saved data initialization in WP Auth (Registration, Login, Forgot Password) Page.',
          'Fixed problem with empty values in exported entries for file upload and signature fields.',
        ],
      },
      coming: {
        label: <b>Coming Soon</b>,
        list: [
          'Frontend Entry View, Edit & Delete (CRUD)',
        ],
      },
    },
  },
}

export default changelogInfo

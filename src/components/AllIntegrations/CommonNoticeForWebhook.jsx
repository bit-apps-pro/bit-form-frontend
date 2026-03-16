export default function CommonNoticeForWebhook({ integrationName }) {
  return (
    <div>
      <p>
        <strong>Note:</strong>
        {' '}
        This integration does not require authorization or connecting to any external app. You can integrate it directly with any form.
      </p>
      <p>
        To integrate with
        {' '}
        {integrationName}
        , create or edit a form, go to
        <strong> Form Settings</strong>
        , navigate to the
        <strong> Integrations</strong>
        {' '}
        menu, select
        {' '}
        <strong>{integrationName}</strong>
        , and complete the required steps.
      </p>
    </div>
  )
}

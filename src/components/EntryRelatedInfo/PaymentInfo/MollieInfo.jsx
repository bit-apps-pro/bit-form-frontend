import { useAtomValue } from 'jotai'
import { __ } from '../../../Utils/i18nwrap'
import noData from '../../../resource/img/nodata.svg'
import { $bits } from '../../../GlobalStates/GlobalStates'
import { dateTimeFormatter } from '../../../Utils/Helpers'

const generateParsedInfo = info => {
  if (info?.payment_response) {
    return JSON.parse(info.payment_response)
  }

  return {}
}

export default function MollieInfo({ paymentInfo, payInfoFound }) {
  const bits = useAtomValue($bits)
  const dateTimeFormat = `${bits.dateFormat} ${bits.timeFormat}`
  const mollieResp = generateParsedInfo(paymentInfo)

  console.log(mollieResp)
  return (
    <div>
      {payInfoFound.current === 1
        ? (
          <>
            <h1>{__('Mollie')}</h1>
            <div key={mollieResp.id}>
              <small>
                {dateTimeFormatter(mollieResp.createdAt, dateTimeFormat)}
              </small>
              <br />
              <br />
              <small>{`${__('Status')}: ${mollieResp.status}`}</small>
              <br />
              <br />
              <small>{`${__('Payment Method')}: ${mollieResp.method}`}</small>
              <br />
              <br />
              <small>
                <b>{`${__('Transaction ID')}: ${mollieResp.id}`}</b>
              </small>
              <p>
                {__('Total Paid')}
                :
                {' '}
                {mollieResp.amount.value}
                {' '}
                {mollieResp.amount.currency}
              </p>
            </div>
          </>
        )
        : <img src={noData} alt={__('no data found')} style={{ height: 150, width: '100%' }} />}
    </div>
  )
}

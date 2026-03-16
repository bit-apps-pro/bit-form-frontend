import { __ } from '../../../Utils/i18nwrap'
import bitsFetch from '../../../Utils/bitsFetch'

export const refreshGetUpdates = (telegramConf, setTelegramConf, setIsLoading, setSnackbar) => {
  const newConf = { ...telegramConf }
  const requestParams = { bot_api_key: newConf.bot_api_key }
  setIsLoading(true)
  bitsFetch(requestParams, 'bitforms_refresh_get_updates')
    .then(result => {
      if (result && result.success) {
        if (!newConf.default) {
          newConf.default = {}
        }

        if (result.data.telegramChatLists) {
          newConf.default.telegramChatLists = result.data.telegramChatLists
        }
        setSnackbar({ show: true, msg: __('Chat list refreshed') })
        setTelegramConf({ ...newConf })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Chat list refresh failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
      } else {
        setSnackbar({ show: true, msg: __('Chat list refresh failed. please try again') })
      }
      setIsLoading(false)
    })
    .catch(() => setIsLoading(false))
}

export const handleInput = (e, telegramConf, setTelegramConf) => {
  const newConf = { ...telegramConf }
  newConf.name = e.target.value
  setTelegramConf({ ...newConf })
}

export const allowUploadedFiletype = ['file-up', 'advanced-file-up', 'signature']
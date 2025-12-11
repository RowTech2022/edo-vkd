/** Функция цикличной загрузки модуля JCWebClient2.
    Асинхронная функция.

    @param params - объект с callback-функциями:
        onLoad - функция срабатывает при успешной установке модуля JC-WebClient. Может быть вызвана только один раз;
        onError - функция срабатывает неудачной установке модуля JC-WebClient. Может быть вызвана несколько раз.
*/
let pluginLoaded = false
function getJCWebClient(params: any) {
  // Проверка наличия модуля JCWebClient2 на Web-странице
  if (typeof JCWebClient2 !== 'undefined' || pluginLoaded) {
    // Модуль JCWebClient2 установлен
    params.onLoad()
    return
  }

  // Получение скрипта JC-WebClient
  getScript(
    'https://localhost:24738/JCWebClient.js',
    params.onLoad,
    function (error: any) {
      if (typeof params.onError === 'function') {
        params.onError(error)
      }

      // Повторная попытка получения скрипта после 2-х секундного таймаута
      setTimeout(function () {
        getJCWebClient(params)
      }, 2000)
    }
  )
}

/** Функция загрузки скрипта.

    @param src - адрес расположения скрипта;
    @param done - callback-функция, срабатывающая при успешной загрузки скрипта;
    @param fail - callback-функция, срабатывающая при неудачной загрузки скрипта.
*/
function getScript(src: string, done: any, fail: any) {
  const jcWeb = document.getElementById('jcweb')
  if (jcWeb) return
  var parent = document.getElementsByTagName('body')[0]

  var script = document.createElement('script') as any
  script.type = 'text/javascript'
  script.src = src
  script.setAttribute('id', 'jcweb')

  if (script.readyState) {
    // IE
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null
        // На некоторых браузерах мы попадаем сюда и в тех случаях когда скрипт не загружен,
        // поэтому дополнительно проверяем валидность JCWebClient2
        if (typeof JCWebClient2 === 'undefined') {
          onFail('JCWebClient is invalid')
        } else {
          done()
        }
      } else if (script.readyState !== 'loading') {
        onFail("JCWebClient hasn't been loaded")
      }
    }
  } else {
    // Others
    script.onload = done
    script.onerror = function () {
      onFail("JCWebClient hasn't been loaded")
    }
  }

  parent.appendChild(script)

  function onFail(errorMsg: string) {
    parent.removeChild(script)
    fail(errorMsg)
  }
}

export const getEtokenPlugin = () =>
  new Promise((resolve, reject) => {
    if (pluginLoaded) {
      resolve(JCWebClient2)
      return
    }
    // 1. Загрузка скрипта JCWebClient.js
    getJCWebClient({
      onLoad: function () {
        // Скрипт JCWebClient.js загружен и модуль JCWebClient2 установлен

        const etokenPlugin = JCWebClient2
        pluginLoaded = true

        resolve(JCWebClient2)
      },
      onError: function (error: any) {
        // Скрипт JCWebClient.js не загружен

        this.onError = undefined // очищаем callback для того, чтобы код ниже выполнился только самый первый раз

        // Отобразите пользователю информационное сообщение о необходимости установить JC-WebClient.
        // В этом же сообщении сообщите о том, что загрузка инсталлятора JC-WebClient на ПК пользователя
        // начнётся автоматически, но если не началась в течение, например, 5 секунд,
        // предложите нажать на специальную ссылку для скачивания инсталлятора с Web-сервера.
        console.log('Установите JC-WebClient !!!')
        reject(null)
      },
    })
  })

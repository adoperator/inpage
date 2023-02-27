export default class AdopInPagePush {
  constructor(params) {
    this.config = {
      debug: false,
      zone: null,
      count: 3,
      time_out_start: 2,
      time_out_message: 5,
      position: '[]',
      format: '[]',
    }

    this.format = this.getFormat()

    this.totalShow = 0
    this.inShow = 0

    this.originalTitle = document.title
    this.titleInteraval = null;

    this.baseUrl = 'https://zone.adopexchange.com'
    this.container = null

    this.config = this.extend(this.config, params || {})
    this.init()
  }

  init() {
    this.log(this.config)
    this.appendStyle()
    setTimeout(() => this.getAds(), this.config.time_out_start * 1000)
  }

  getFormat() {
    let FORMATS = [
      'small',
      // 'large',
      'overlay'
    ];

    let formats = JSON.parse(this.config.format).filter((p) => FORMATS.includes(p))

    if (formats.length === 0) {
      formats = FORMATS
    }

    let format = this.random(formats)

    let Format = require(`./formats/${format}/format.js`).Format

    return new Format()
  }

  random(data) {
    return data[Math.floor(Math.random() * data.length)]
  }

  extend(defaults, options) {
    let extended = {}
    let prop

    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = defaults[prop]
      }
    }

    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop) && options[prop] != null) {
        extended[prop] = options[prop]
      }
    }

    return extended
  }

  log(msg) {
    if (this.isDebugMode()) console.log(msg)
  }

  isDebugMode() {
    return this.config.debug === true
  }

  getPositionClass() {
    const POSITIONS = ['t-l', 't-r', 'b-l', 'b-r']

    let positions = JSON.parse(this.config.position).filter((p) => POSITIONS.includes(p))

    if (positions.length === 0) {
      positions = POSITIONS
    }

    let target = this.random(positions)

    return 'adoperator_' + target
  }

  http_build_query(jsonObj) {
    const keys = Object.keys(jsonObj)
    const values = keys.map(key => jsonObj[key])

    return keys
        .map((key, index) => {
          return `${key}=${values[index]}`
        })
        .join('&')
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  appendStyle() {
    const head = document.head || document.getElementsByTagName('head')[0]
    const style = document.createElement('style')

    head.appendChild(style)

    if (style.styleSheet) {
      style.styleSheet.cssText = this.format.css()
    } else {
      style.appendChild(document.createTextNode(this.format.css()))
    }
  }

  appendContainer() {
    this.container = document.createElement('div')
    this.container.className = 'adoperator_inp_container ' + this.getPositionClass()
    document.body.appendChild(this.container)
    return this.container
  }

  getContainer() {
    if (!this.container) {
      return this.appendContainer()
    }
    return this.container
  }

  async response(data) {
    this.log(data)

    if (typeof data != 'object' || !data.length) {
      this.log('Empty response')
      return
    }

    this.totalShow += data.length

    for (const key in data) {
      this.showAd(data[key])
      await this.sleep(this.config.time_out_message * 1000)
    }
  }

  showAd(data) {
    this.preload(data).then((block) => {
      this.log('showAd: ' + data.id)
      this.getContainer().appendChild(block)
      this.activateBlock(block)
    })
  }

  activateBlock(block) {
    setTimeout(() => {
      block.classList.add('adoperator_inp--active')
      this.inShow++;
      this.updateTitle()
    }, 10)
  }

  deactivateBlock(block) {
    this.totalShow--
    this.inShow--

    this.updateTitle()

    block.classList.remove("adoperator_inp--active")
    this.sleep(500).then(() => block.remove())
  }

  updateTitle() {
    this.clearTitle()

    let message = `New message (${this.inShow})`
    let original = this.originalTitle
    let i = 0;

    document.title = message

    this.titleInteraval = setInterval(function () {
      document.title = !(i % 2) ? original : message
      i++
    }, 2000)
  }

  clearTitle() {
    clearInterval(this.titleInteraval)
    document.title = this.originalTitle
  }

  preload(data) {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.className = 'adoperator_inp--img'
      image.alt = '';
      image.src = data.icon_url
      image.onload = () => {
        let close = this.getCloseElement(data)
        let block = this.format.html(data, image, close)
        resolve(block)
      }
    })
  }

  getCloseElement(data) {
    let close = document.createElement('span')
    close.className = 'adoperator_inp--close'
    close.innerHTML = 'x'
    close.onclick = () => this.onClickClose(data.id)
    return close
  }

  onClickClose(id) {
    this.deactivateBlock(document.getElementById(id))

    if (this.totalShow === 0) {
      this.clearTitle()

      if (this.format.get_ads_on_close) {
        this.sleep(this.config.time_out_message * 1000).then(() => this.getAds())
      }
    }
  }

  getAds() {
    if (!this.config.zone) {
      this.log('"zone" is required field')
      return
    }

    let xhr = new XMLHttpRequest()

    let query = {
      zone: this.config.zone,
    }

    this.log(query)

    query = this.http_build_query(query)

    xhr.open('GET', this.baseUrl + '/api/v1/settings?' + query, true)

    xhr.onreadystatechange = x => {
      const response = x.target

      if (response.readyState === 4) {
        if (response.status === 200) {
          try {
            let resp = JSON.parse(response.responseText);

            this.config = this.extend(this.config, resp.settings || {})

            this.log(this.config)

            this.response(resp.bidResponse)
          } catch (error) {
            this.log(error)
          }
        }
      }
    }

    xhr.send()
  }
}

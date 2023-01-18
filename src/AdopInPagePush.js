export default class AdopInPagePush {
  constructor(params) {
    this.config = {
      debug: false,
      zone: null,
      count: 3,
      time_out_start: 2,
      time_out_message: 5,
      position: 't-r',
    }

    this.inShow = 0

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

  extend(defaults, options) {
    var extended = {}
    var prop
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

  position() {
    return this.config.position ?
        'adoperator_' + this.config.position
        : 'adoperator_t-r'
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
      style.styleSheet.cssText = this.css()
    } else {
      style.appendChild(document.createTextNode(this.css()))
    }
  }

  appendContainer() {
    this.container = document.createElement('div')
    this.container.className = 'adoperator_inp_container ' + this.position()
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

    this.inShow += data.length

    for (const key in data) {
      this.showAd(data[key])
      await this.sleep(this.config.time_out_message * 1000)
    }
  }

  showAd(data) {
    this.log('showAd: ' + data.id)
    let block = this.createAdBlock(data)
    this.getContainer().appendChild(block)
    setTimeout(() => {
      block.className = 'adoperator_inp adoperator_inp--active'
    }, 1)
  }

  createAdBlock(data) {
    let close = document.createElement('span')
    close.className = 'adoperator_inp--close'
    close.onclick = () => {
      this.inShow--

      let ad = document.getElementById(data.id)
      ad.classList.remove("adoperator_inp--active")
      this.sleep(500).then(() => ad.remove())

      if (this.inShow === 0) {
        this.sleep(this.config.time_out_message * 1000).then(() => this.getAds())
      }
    }
    close.innerHTML = 'x'

    let ad = document.createElement('a')
    ad.href = data.click_url
    ad.target = '_blank'
    ad.rel = 'noopener noreferrer'
    ad.innerHTML = `
    <div class="adoperator_inp--img" style="background-image:url(${data.icon_url})"></div>
    <div class="adoperator_inp--desc">
      <p>${data.title}</p>
      <span>${data.text || ''}</span>
    </div>`

    let block = document.createElement('div')
    block.id = data.id
    block.className = 'adoperator_inp'

    block.appendChild(close)
    block.appendChild(ad)

    return block
  }

  getAds() {
    if (!this.config.zone) {
      this.log('"zone" is required field')
      return
    }

    var xhr = new XMLHttpRequest()

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

  css() {
    return `.adoperator_inp_container {
      position: fixed;
      z-index: 99999999999;
      width: 333px;
      overflow: hidden;
    }
    .adoperator_t-r {
      right: 0;
      top: 5%;
    }
    .adoperator_t-l {
      left: 0;
      top: 5%;
    }
    .adoperator_b-r {
      right: 0;
      bottom: 5%;
    }
    .adoperator_b-l {
      left: 0;
      bottom: 5%;
    }
    .adoperator_t-l > .adoperator_inp,
    .adoperator_b-l > .adoperator_inp {
      left: -335px;
      margin-left: 15px;
     }
    .adoperator_t-r > .adoperator_inp,
    .adoperator_b-r > .adoperator_inp {
      right: -335px;
      margin-right: 15px;
     }
    .adoperator_t-l > .adoperator_inp--active,
    .adoperator_b-l > .adoperator_inp--active {
      left: -5px;
     }
    .adoperator_t-r > .adoperator_inp--active,
    .adoperator_b-r > .adoperator_inp--active {
      right: -5px;
     }
    .adoperator_inp {
      position: relative;
      z-index: 999999;
      width: 310px;
      margin-bottom: 15px;
      min-height: 72px;
      background-color: #fff;
      border: 1px solid #e0e0e0;
      -webkit-box-shadow: 1px 2px 9px 1px #0000001a;
      -moz-box-shadow: 1px 2px 9px 1px #0000001a;
      box-shadow: 1px 2px 9px 1px #0000001a;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
      border-radius: 6px;
      padding: 5px;
      font-family: 'Roboto', Arial, Helvetica, sans-serif;
      -webkit-transition: all 500ms cubic-bezier(0.735, 0.16, 0.38, 1.58);
      -moz-transition: all 500ms cubic-bezier(0.735, 0.16, 0.38, 1.58);
      -o-transition: all 500ms cubic-bezier(0.735, 0.16, 0.38, 1.58);
      transition: all 500ms cubic-bezier(0.735, 0.16, 0.38, 1.58);
      -webkit-transition-timing-function: cubic-bezier(0.735, 0.16, 0.38, 1.58);
      -moz-transition-timing-function: cubic-bezier(0.735, 0.16, 0.38, 1.58);
      -o-transition-timing-function: cubic-bezier(0.735, 0.16, 0.38, 1.58);
      transition-timing-function: cubic-bezier(0.735, 0.16, 0.38, 1.58);
    }
    
    .adoperator_inp a {
      color: #353535;
      text-decoration: none;
      display: block;
      outline: 0;
    }
    
    .adoperator_inp .adoperator_inp--close {
      position: absolute;
      right: 10px;
      background-color: #c5c5c5;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      height: 16px;
      width: 16px;
      font-size: 12px;
      line-height: 14px;
      color: #fff;
      text-align: center;
      z-index: 99999;
      cursor: pointer;
    }
    
    .adoperator_inp .adoperator_inp--img {
      background-image: url();
      -webkit-background-size: contain;
      -moz-background-size: contain;
      -o-background-size: contain;
      background-size: contain;
      background-repeat: no-repeat;
      width: 72px;
      height: 72px;
      margin-right: 8px;
      display: inline-block;
      vertical-align: middle;
    }
    .adoperator_inp .adoperator_inp--desc {
      display: inline-block;
      vertical-align: top;
      width: 200px;
      margin: 0;
      padding: 0 0 5px;
    }
    .adoperator_inp .adoperator_inp--desc p {
      margin: 1px 0 10px;
      font-size: 14px;
      padding: 0;
      font-weight: 700;
    }
    .adoperator_inp .adoperator_inp--desc span {
      font-size: 12px;
      margin: 0;
      padding: 0;
      font-weight: 400;
    }
    @media screen and (max-width: 340px) {
      .adoperator_inp_container {
        width: 300px;
      }
      .adoperator_inp {
        width: 100%;
        min-width: 236px;
        max-width: 280px;
        min-height: auto;
        right: -100%;
      }
      .adoperator_inp.adoperator_inp--active {
        right: -5px;
      }
      .adoperator_inp .adoperator_inp--desc {
        width: 63%;
      }
      .adoperator_inp .adoperator_inp--desc p {
        font-size: 13px;
        margin: 0 0 10px;
      }
      .adoperator_inp .adoperator_inp--img {
        width: 68px;
        height: 68px;
      }
      .adoperator_inp .adoperator_inp--close {
        height: 13px;
        width: 13px;
        font-size: 11px;
      }
    }`
  }
}

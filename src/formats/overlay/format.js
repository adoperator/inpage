import styles from './styles.css'
import { BaseFormat } from '../BaseFormat'

class Format extends BaseFormat {
  name = 'overlay'

  get_ads_on_close = false

  constructor() {
      super()
  }

  html(data, image, close) {
      let ad = document.createElement('a')
      ad.href = data.click_url
      ad.target = '_blank'
      ad.rel = 'noopener noreferrer'

      ad.appendChild(image)

      let desc = document.createElement('div')
      desc.className = 'adoperator_inp--desc'
      desc.innerHTML = `<p>${data.title}</p><span>${data.text || ''}</span>`

      ad.appendChild(desc)

      let block = document.createElement('div')
      block.className = 'adoperator_block'

      block.appendChild(ad)

      let overlay = document.createElement('div')
      overlay.id = data.id
      overlay.className = 'adoperator_inp adoperator_overlay'

      overlay.appendChild(close)
      overlay.appendChild(block)

      return overlay
  }

  css() {
      return styles
  }
}

export { Format }
import styles from './styles.css'
import { BaseFormat } from '../BaseFormat'

class Format extends BaseFormat {
  name = 'small'

  get_ads_on_close = true

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
      block.id = data.id
      block.className = 'adoperator_inp'

      block.appendChild(close)
      block.appendChild(ad)

      return block
  }

  css() {
      return styles
  }
}

export { Format }
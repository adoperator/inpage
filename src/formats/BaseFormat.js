export class BaseFormat {
    name = 'default'

    get_ads_on_close = false

    constructor() {}

    html(data, image, close) {
        return document.createElement('div')
    }

    css() {
        return ''
    }
}
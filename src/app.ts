import cheerio from 'cheerio'
import request from './util/request'

import { BASE_URL, MOVIE_LIST } from './const/index'

interface MovieSimpleItem {
  title: string
  url: string | undefined
  clickNum: number
  createDate: number
}

class App {
  constructor() {
    this.initProcess()
  }

  async initProcess() {
    const htmlRow = await this.getRowHtml()
    const movieListRes = this.getMovieListInfo(htmlRow)
    this.saveInfo(movieListRes)
  }

  async getRowHtml() {
    const html = await request(MOVIE_LIST)
    return html.text
  }

  getMovieListInfo(html: string) {
    const movieSimpleList: MovieSimpleItem[] = []
    const $ = cheerio.load(html)

    const fileInfoItems = $('.tbspan')

    fileInfoItems.map((_, item) => {
      const reg = /《(.+)》/
      const title = $(item).find('.ulink')

      const titleText = reg.exec(title.text())![1]
      const titleLink = `${BASE_URL}${title.attr('href')}`

      const dateAndClick = $(item).find('font').text()
      const clickNum = dateAndClick.split('：')[2].trim()
      const writeDate = dateAndClick.split('：')[1].split('\n')[0].trim()

      movieSimpleList.push({
        title: titleText,
        url: titleLink,
        clickNum: parseInt(clickNum),
        createDate: new Date(writeDate).getTime()
      })
    })

    return movieSimpleList
  }

  saveInfo(info: MovieSimpleItem[]) {
    console.log(JSON.stringify(info))
  }
}

const app = new App()
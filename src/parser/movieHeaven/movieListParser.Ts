import fs from 'fs'
import cheerio from 'cheerio'
import { BASE_URL } from '../../const/index'
import { Parser } from '../../app'

interface MovieSimpleItem {
  id: string
  title: string
  url: string | undefined
  clickNum: number
  createDate: number
}

export default class MovieListParser implements Parser {
  private getMovieListInfo(html: string) {
    const movieSimpleList: MovieSimpleItem[] = []
    const $ = cheerio.load(html)

    const fileInfoItems = $('.tbspan')

    fileInfoItems.map((_, item) => {
      const titleReg = /《(.+)》/
      const idReg = /\/([0-9]+)\.html/
      const title = $(item).find('.ulink')

      const titleText = titleReg.exec(title.text())![1]
      const movieId = idReg.exec(title.attr('href')!)![1]
      const titleLink = `${BASE_URL}${title.attr('href')}`

      const dateAndClick = $(item).find('font').text()
      const clickNum = dateAndClick.split('：')[2].trim()
      const writeDate = dateAndClick.split('：')[1].split('\n')[0].trim()

      movieSimpleList.push({
        id: movieId,
        title: titleText,
        url: titleLink,
        clickNum: parseInt(clickNum),
        createDate: new Date(writeDate).getTime()
      })
    })

    return movieSimpleList
  }

  // 转换为json
  private generateJsonContent(info: MovieSimpleItem[], filePath: string) {
    let fileContent: MovieSimpleItem[] = []

    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    // TODO 去重操作
    // fileContent = [...fileContent, ...info]
    fileContent = info
    return fileContent
  }

  public parse(html: string, filePath: string): string {
    const listInfo = this.getMovieListInfo(html)
    const res = this.generateJsonContent(listInfo, filePath)
    return JSON.stringify(res)
  }
}
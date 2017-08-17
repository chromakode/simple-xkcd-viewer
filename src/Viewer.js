import h from './hyperscript'
import clamp from './clamp'

const NAV_HEIGHT = 40
const NAV_PADDING = 10
const NAV_SPACE = 10
const SPINNER_BG = "url('loading.gif') center center no-repeat"

export default class Viewer {
  constructor({ initNum, firstNum, latestNum, fetchNum, onChange }) {
    this.firstNum = firstNum
    this.latestNum = latestNum
    this.fetchNum = fetchNum
    this.onChange = onChange
    this._num = initNum
    this._el = null
    this._comicContainerEl = null
    this._comicEl = null
    this._loadingInfo = false
    this._spinnerTimeout = null
  }

  setup(parentEl) {
    const navButtonStyle = {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '4px',
    }

    this._comicContainerEl = h('div', {
      className: 'comic-container',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0, // Allow tall comics to scroll.
        flexGrow: 1,
        paddingBottom: `${NAV_HEIGHT + (NAV_PADDING * 2) + NAV_SPACE} px`,
      },
    })

    this._el = h('div', {
      className: 'viewer',
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      },
    }, [
      this._comicContainerEl,
      h('nav', {
        style: {
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: `${NAV_HEIGHT} px`,
          display: 'flex',
          justifyContent: 'center',
          padding: `${NAV_HEIGHT} px`,
          background: 'white',
        },
      }, [
        h('button', {
          style: navButtonStyle,
          onClick: () => this.gotoFirst(),
        }, '« first'),
        h('button', {
          style: navButtonStyle,
          onClick: () => this.gotoPrev(),
        }, '‹ prev'),
        h('button', {
          style: navButtonStyle,
          onClick: () => this.gotoNext(),
        }, 'next ›'),
        h('button', {
          style: navButtonStyle,
          onClick: () => this.gotoLatest(),
        }, 'latest »'),
      ]),
    ])

    parentEl.appendChild(this._el)
    this._displayComic(this._num)
  }

  gotoFirst() {
    this._goto(this.firstNum)
  }

  gotoPrev() {
    this._goto(this._num - 1)
  }

  gotoNext() {
    this._goto(this._num + 1)
  }

  gotoLatest() {
    this._goto(this.latestNum)
  }

  _goto(num) {
    if (this._loadingInfo) {
      return
    }
    const nextNum = clamp(this.firstNum, num, this.latestNum)
    if (nextNum !== this._num) {
      this._num = nextNum
      this._displayComic(this._num)
    }
  }

  async _displayComic(num) {
    this._clearSpinner()
    this._startSpinner()
    this._loadingInfo = true
    if (this._comicEl) {
      // Fade out old comic.
      this._comicEl.style.opacity = 0
    }

    const comicInfo = await this.fetchNum(num)
    this._loadingInfo = false

    const comicEl = h('div', {
      className: 'comic',
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.5s ease',
        opacity: 0,
      },
    }, [
      h('h1', {
        className: 'title',
      }, `#${comicInfo.num} ‒ ${comicInfo.title}`),
      h('img', {
        title: comicInfo.alt,
        src: comicInfo.img,
        onLoad: () => { this._onComicLoad(comicEl) },
        onError: () => { this._onComicError(comicEl) },
        style: {
          padding: '16px',
          background: 'white',
          boxShadow: '0 0 5px rgba(0, 0, 0, .5)',
        },
      }),
    ])
    this._comicEl = comicEl

    this._comicContainerEl.innerHTML = ''
    this._comicContainerEl.appendChild(this._comicEl)
    this.onChange(comicInfo)

    this._preload(num)
  }

  async _preload(num) {
    // Preload next and prev metadata (and cache).
    const toFetch = []
    if (num > this.firstNum) {
      toFetch.push(this.fetchNum(num - 1))
    }
    if (num < this.latestNum) {
      toFetch.push(this.fetchNum(num + 1))
    }
    const comicInfos = await Promise.all(toFetch)

    // Preload next and prev images.
    comicInfos.forEach(({ img }) => {
      const imgEl = new Image()
      imgEl.src = img
    })
  }

  _startSpinner() {
    // Only show timer after waiting 200ms.
    this._spinnerTimeout = setTimeout(() => {
      this._comicContainerEl.style.background = SPINNER_BG
    }, 200)
  }

  _clearSpinner() {
    this._comicContainerEl.style.background = 'none'
    clearTimeout(this._spinnerTimeout)
  }

  _onComicLoad(comicEl) {
    if (!comicEl.parentNode) {
      // This comic has already replaced in the DOM.
      return
    }
    this._clearSpinner()

    // Force a reflow so transitions always apply.
    comicEl.offsetHeight // eslint-disable-line no-unused-expressions
    comicEl.style.opacity = 1 // eslint-disable-line no-param-reassign
  }

  _onComicError(comicEl) {
    if (!comicEl.parentNode) {
      return
    }
    this._clearSpinner()
    this._comicContainerEl.innerHTML = ''
    this._comicContainerEl.appendChild(h('h1', {
      style: {
        color: 'red',
      },
    }, 'Unable to load comic. :('))
  }
}

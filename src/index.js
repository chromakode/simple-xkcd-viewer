import CachedComicAPI from './CachedComicAPI'
import Viewer from './Viewer'

async function init() {
  const api = new CachedComicAPI()
  const latest = await api.initLatest()

  let urlNum
  try {
    urlNum = Number(location.hash.substr(1))
  } catch (err) {
    // Ignore invalid location hashes -- they'll get replaced when the comic loads.
  }

  const viewer = new Viewer({
    initNum: urlNum || latest.num,
    firstNum: 1,
    latestNum: latest.num,
    fetchNum: num => api.fetchNum(num),
    onChange: ({ title, num }) => {
      document.title = title
      location.hash = num
    },
  })
  viewer.setup(document.body)

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft') {
      viewer.gotoPrev()
    } else if (ev.key === 'ArrowRight') {
      viewer.gotoNext()
    } else if (ev.key === 'ArrowUp') {
      viewer.gotoFirst()
    } else if (ev.key === 'ArrowDown') {
      viewer.gotoLatest()
    }
  }, false)
}

init().catch(err => console.error(err)) // eslint-disable-line no-console

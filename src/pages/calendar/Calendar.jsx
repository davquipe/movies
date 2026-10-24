import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { BsCalendar3, BsFilm, BsTv } from 'react-icons/bs'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import Spinner from '../../components/spinner/Spinner'
import { fetchDataApi } from '../../utils/api'
import './Calendar.scss'

const Calendar = () => {
	const [activeTab, setActiveTab] = useState('movies')
	const [region, setRegion] = useState(() => localStorage.getItem('movies-region') || 'PE')
	const [moviePages, setMoviePages] = useState([])
	const [episodes, setEpisodes] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const today = dayjs()
	const weekEnd = today.add(6, 'day')

	useEffect(() => {
		let active = true
		setLoading(true)
		setError(false)
		const tasks = activeTab === 'movies'
			? [1, 2].map((page) => fetchDataApi('/movie/upcoming', { params: { region, page, language: 'en-US' } }))
			: [
				fetchDataApi('/tv/airing_today', { params: { language: 'en-US', page: 1 } }),
				fetchDataApi('/tv/on_the_air', { params: { language: 'en-US', page: 1 } }),
			]
		Promise.all(tasks).then(async (responses) => {
			if (!active) return
			if (activeTab === 'movies') {
				const results = responses.flatMap((response) => response?.results || [])
				const unique = [...new Map(results.map((item) => [item.id, item])).values()]
				setMoviePages(unique.filter((item) => item.release_date && dayjs(item.release_date).isAfter(today.subtract(1, 'day'))).sort((a, b) => a.release_date.localeCompare(b.release_date)))
				setEpisodes([])
				return
			}

			const series = [...new Map(responses.flatMap((response) => response?.results || []).map((item) => [item.id, item])).values()]
			const upcomingEpisodes = series.map((show) => {
				const episode = show.next_episode_to_air
				const isInRange = episode?.air_date && dayjs(episode.air_date).isAfter(today.subtract(1, 'day')) && dayjs(episode.air_date).isBefore(weekEnd.add(1, 'day'))
				return isInRange ? { ...episode, showId: show.id, showName: show.name, poster_path: show.poster_path, media_type: 'tv' } : null
			})
			if (active) {
				setEpisodes(upcomingEpisodes.filter(Boolean).sort((a, b) => a.air_date.localeCompare(b.air_date)))
				setMoviePages([])
			}
		}).catch(() => { if (active) setError(true) }).finally(() => { if (active) setLoading(false) })
		return () => { active = false }
	}, [activeTab, region])

	const items = activeTab === 'movies' ? moviePages : episodes
	const groupedItems = useMemo(() => items.reduce((groups, item) => {
		const date = activeTab === 'movies' ? item.release_date : item.air_date
		const key = dayjs(date).format('YYYY-MM-DD')
		groups[key] ||= []
		groups[key].push(item)
		return groups
	}, {}), [items, activeTab])

	const changeRegion = (event) => {
		setRegion(event.target.value)
		localStorage.setItem('movies-region', event.target.value)
	}

	return (
		<main className="releaseCalendar">
			<Helmet><title>Release Calendar | Movies</title><meta name="description" content="Upcoming movie releases and TV episodes" /></Helmet>
			<ContentWrapper>
				<header className="releaseCalendar__header">
					<div className="releaseCalendar__heading">
						<p className="releaseCalendar__eyebrow"><BsCalendar3 aria-hidden="true" /> Your watch guide</p>
						<h1>Release calendar</h1>
						<p className="releaseCalendar__description">The next stories to add to your watchlist.</p>
					</div>
					{activeTab === 'movies' && <label className="releaseCalendar__region"><span>Movie release region</span><select value={region} onChange={changeRegion}><option value="PE">Peru</option><option value="US">United States</option><option value="MX">Mexico</option><option value="AR">Argentina</option><option value="CL">Chile</option><option value="CO">Colombia</option><option value="ES">Spain</option><option value="BR">Brazil</option></select></label>}
				</header>
				<div className="releaseCalendar__tabs" role="tablist" aria-label="Calendar content">
					<button className={activeTab === 'movies' ? 'releaseCalendar__tab releaseCalendar__tab--active' : 'releaseCalendar__tab'} type="button" role="tab" aria-selected={activeTab === 'movies'} onClick={() => setActiveTab('movies')}><BsFilm aria-hidden="true" /> Upcoming movies</button>
					<button className={activeTab === 'episodes' ? 'releaseCalendar__tab releaseCalendar__tab--active' : 'releaseCalendar__tab'} type="button" role="tab" aria-selected={activeTab === 'episodes'} onClick={() => setActiveTab('episodes')}><BsTv aria-hidden="true" /> New TV episodes</button>
				</div>
				{loading ? <Spinner initial /> : error ? <p className="releaseCalendar__empty">We couldn&apos;t load the calendar. Please try again.</p> : Object.keys(groupedItems).length ? <div className="releaseCalendar__timeline">
					{Object.entries(groupedItems).map(([date, entries]) => <section className="releaseCalendar__day" key={date}>
						<div className="releaseCalendar__dayHeader"><span className="releaseCalendar__dayDate">{dayjs(date).format('ddd, MMM D')}</span><span className="releaseCalendar__dayLine" /></div>
						<div className="releaseCalendar__items">{entries.map((item) => {
							const itemId = activeTab === 'movies' ? item.id : item.showId
							const label = activeTab === 'movies' ? item.title : item.showName
							const image = item.poster_path ? `https://image.tmdb.org/t/p/w185${item.poster_path}` : null
							return <Link className="releaseCalendar__item" to={`/${activeTab === 'movies' ? 'movie' : 'tv'}/${itemId}`} key={`${itemId}-${date}`}>
								<div className="releaseCalendar__poster">{image ? <img src={image} alt="" loading="lazy" /> : <span>{activeTab === 'movies' ? <BsFilm /> : <BsTv />}</span>}</div>
								<div className="releaseCalendar__itemInfo"><span className="releaseCalendar__itemType">{activeTab === 'movies' ? 'Movie premiere' : `Season ${item.season_number || '—'} · Episode ${item.episode_number || '—'}`}</span><strong>{label}</strong>{activeTab === 'episodes' && <span className="releaseCalendar__episodeName">{item.name}</span>}</div>
								<span className="releaseCalendar__itemDate">{dayjs(date).format('MMM D')}</span>
							</Link>
						})}</div>
					</section>)}
				</div> : <p className="releaseCalendar__empty">Nothing scheduled for this period yet. Check back soon.</p>}
			</ContentWrapper>
		</main>
	)
}

export default Calendar

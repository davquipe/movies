/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { BsCollectionPlay } from 'react-icons/bs'
import dayjs from 'dayjs'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import Spinner from '../../components/spinner/Spinner'
import { fetchDataApi } from '../../utils/api'
import './TvSeasons.scss'

const TvSeasons = ({ showId, seasons = [] }) => {
	const availableSeasons = seasons.filter((season) => season.season_number > 0)
	const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(null)
	const seasonNumber = selectedSeasonNumber ?? availableSeasons[0]?.season_number ?? seasons[0]?.season_number ?? 0
	const [season, setSeason] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => {
		if (!seasons.length) return undefined
		let active = true
		setLoading(true)
		setError(false)
		fetchDataApi(`/tv/${showId}/season/${seasonNumber}`)
			.then((response) => { if (active) { setSeason(response || null); setError(!response) } })
			.catch(() => { if (active) setError(true) })
			.finally(() => { if (active) setLoading(false) })
		return () => { active = false }
	}, [showId, seasonNumber, seasons.length])

	if (!seasons.length) return null
	const activeSeason = seasons.find((item) => item.season_number === seasonNumber)

	return (
		<section className="tvSeasons">
			<ContentWrapper>
				<header className="tvSeasons__header">
					<div><p className="tvSeasons__eyebrow">Explore every chapter</p><h2 className="tvSeasons__title">Seasons &amp; episodes</h2><p className="tvSeasons__description">Browse the episodes in {activeSeason?.name || 'this series'}.</p></div>
					<label className="tvSeasons__selectLabel"><span>Choose a season</span><select value={seasonNumber} onChange={(event) => setSelectedSeasonNumber(Number(event.target.value))}>{seasons.map((item) => <option value={item.season_number} key={item.id}>{item.name}</option>)}</select></label>
				</header>
				{loading ? <div className="tvSeasons__loading"><Spinner /></div> : error ? <p className="tvSeasons__message">Episode information is unavailable right now.</p> : season?.episodes?.length ? <div className="tvSeasons__list">{season.episodes.map((episode) => <article className="tvSeasons__episode" key={episode.id}>
					<div className="tvSeasons__still">{episode.still_path ? <img src={`https://image.tmdb.org/t/p/w500${episode.still_path}`} alt="" loading="lazy" /> : <span><BsCollectionPlay aria-hidden="true" /></span>}<span className="tvSeasons__episodeNumber">E{String(episode.episode_number).padStart(2, '0')}</span></div>
					<div className="tvSeasons__episodeInfo"><div className="tvSeasons__episodeHeading"><h3>{episode.name}</h3>{episode.air_date && <time dateTime={episode.air_date}>{dayjs(episode.air_date).format('MMM D, YYYY')}</time>}</div>{episode.overview && <p>{episode.overview}</p>}{episode.runtime > 0 && <span className="tvSeasons__runtime">{episode.runtime} min</span>}</div>
				</article>)}</div> : <p className="tvSeasons__message">No episode information is available for this season yet.</p>}
			</ContentWrapper>
		</section>
	)
}

export default TvSeasons

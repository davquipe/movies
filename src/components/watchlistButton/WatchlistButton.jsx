/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux'
import { IoAdd, IoCheckmark } from 'react-icons/io5'
import { toggleWatchlistItem } from '../../store/slice/watchlistSlice'
import './WatchlistButton.scss'

const WatchlistButton = ({ data, mediaType, compact = false }) => {
	const dispatch = useDispatch()
	const media = data.media_type || mediaType
	const items = useSelector((state) => state.watchlist.items)
	const saved = items.some((item) => item.id === data.id && item.mediaType === media)

	const toggle = (event) => {
		event.stopPropagation()
		dispatch(
			toggleWatchlistItem({
				id: data.id,
				mediaType: media,
				title: data.title || data.name,
				poster_path: data.poster_path,
				release_date: data.release_date || data.first_air_date,
				vote_average: data.vote_average,
				genre_ids: data.genre_ids || data.genres?.map((genre) => genre.id) || [],
			}),
		)
	}

	return (
		<button
			type="button"
			className={`watchlistButton ${saved ? 'saved' : ''} ${compact ? 'compact' : ''}`}
			aria-label={`${saved ? 'Remove from' : 'Add to'} watchlist: ${data.title || data.name}`}
			title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
			onClick={toggle}>
			<span className="watchlistButtonIcon" aria-hidden="true">
				{saved ? <IoCheckmark /> : <IoAdd />}
			</span>
			{!compact && (saved ? 'In watchlist' : 'Watchlist')}
		</button>
	)
}

export default WatchlistButton

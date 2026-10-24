/* eslint-disable react/prop-types */
import React from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import './MovieCard.scss'
import Img from '../lazyLoadImage/Img'
import CircleRating from '../circleRating/CircleRating'
import Genres from '../genres/Genres'
import PosterFallback from '../../assets/images/no-poster.png'
import WatchlistButton from '../watchlistButton/WatchlistButton'

const MovieCard = ({ data, fromSearch, mediaType }) => {
	const { url } = useSelector((state) => state.home)
	const navigate = useNavigate()
	const posterUrl = data.poster_path && url.poster
		? url.poster + data.poster_path
		: data.poster_path
			? `https://image.tmdb.org/t/p/w500${data.poster_path}`
		: PosterFallback
	return (
		<div
			className="movieCard"
			onClick={() =>
				navigate(`/${data.media_type || mediaType}/${data.id}`)
			}>
			<div className="posterBlock">
				<Img className="posterImg" src={posterUrl} />
				<WatchlistButton data={data} mediaType={mediaType} compact />
				{!fromSearch && (
					<React.Fragment>
						{Number.isFinite(data.vote_average) && <CircleRating rating={data.vote_average.toFixed(1)} />}
						{!!data.genre_ids?.length && <Genres data={data.genre_ids.slice(0, 2)} />}
					</React.Fragment>
				)}
			</div>
			<div className="textBlock">
				<span className="title">{data.title || data.name}</span>
				<span className="date">
					{data.release_date || data.first_air_date ? dayjs(data.release_date || data.first_air_date).format('MMM D, YYYY') : 'Release date TBA'}
				</span>
			</div>
		</div>
	)
}

export default MovieCard

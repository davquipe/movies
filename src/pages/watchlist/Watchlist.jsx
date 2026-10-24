import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import MovieCard from '../../components/movieCard/MovieCard'
import './Watchlist.scss'

const Watchlist = () => {
	const items = useSelector((state) => state.watchlist.items)

	return (
		<main className="watchlistPage">
			<Helmet><title>My Watchlist | Movies</title></Helmet>
			<ContentWrapper>
				<h1>My Watchlist</h1>
				{items.length ? (
					<div className="watchlistGrid">
						{items.map((item) => (
							<MovieCard key={`${item.mediaType}-${item.id}`} data={item} mediaType={item.mediaType} />
						))}
					</div>
				) : (
					<p className="watchlistEmpty">Your list is empty. Add movies and shows with the + button on a poster.</p>
				)}
			</ContentWrapper>
		</main>
	)
}

export default Watchlist

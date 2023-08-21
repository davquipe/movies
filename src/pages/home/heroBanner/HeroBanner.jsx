import { useEffect, useState } from 'react'
import './HeroBanner.scss'
import { useNavigate } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import { useSelector } from 'react-redux'
import Img from '../../../components/lazyLoadImage/Img'

const HeroBanner = () => {
	const [background, setBackground] = useState('')
	const [query, setQuery] = useState('')
	const navigate = useNavigate()
	const { url } = useSelector((state) => state.home)
	const { data } = useFetch('/movie/upcoming')

	useEffect(() => {
		const bg =
			url.backdrop +
			data?.results[Math?.floor(Math.random() * 20)]?.backdrop_path
		setBackground(bg)
		// if (data) {
		// setBackground(
		// data?.results[Math?.floor(Math.random() * 20)]?.backdrop_path,
		// data?.results[0]?.backdrop_path,
		// )
		// }
	}, [data, url.backdrop])

	const searchQueryHandler = (e) => {
		if (e.key === 'Enter' && query.length > 0) {
			navigate(`/search/${query}`)
		}
	}
	return (
		<div className="heroBanner">
			<div className="backdrop-img">
				<Img src={background} />
			</div>
			<div className="wrapper">
				<div className="heroBannerContent">
					<span className="title">Welcome.</span>
					<span className="subTitle">
						Millions of movies, TV shows and people to discover.
						Explore now.
					</span>
					<div className="searchInput">
						<input
							type="text"
							placeholder="Search for a movie, tv show, person......"
							onChange={(e) => setQuery(e.target.value)}
							onKeyUp={searchQueryHandler}
						/>
						<button>Search</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HeroBanner

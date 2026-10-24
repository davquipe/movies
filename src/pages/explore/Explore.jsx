import { Helmet } from 'react-helmet-async'
import './Explore.scss'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import { useCallback, useEffect, useState } from 'react'
import Select from 'react-select'
import Spinner from '../../components/spinner/Spinner'
import InfiniteScroll from 'react-infinite-scroll-component'
import MovieCard from '../../components/movieCard/MovieCard'
import { fetchDataApi } from '../../utils/api'

const sortbyData = [
	{ value: 'popularity.desc', label: 'Popularity: high to low' },
	{ value: 'popularity.asc', label: 'Popularity: low to high' },
	{ value: 'vote_average.desc', label: 'Rating: high to low' },
	{ value: 'vote_average.asc', label: 'Rating: low to high' },
	{ value: 'primary_release_date.desc', label: 'Release: newest first' },
	{ value: 'primary_release_date.asc', label: 'Release: oldest first' },
	{ value: 'original_title.asc', label: 'Title (A–Z)' },
]

const languageOptions = [
	{ value: 'en', label: 'English' },
	{ value: 'es', label: 'Spanish' },
	{ value: 'fr', label: 'French' },
	{ value: 'ja', label: 'Japanese' },
	{ value: 'ko', label: 'Korean' },
	{ value: 'hi', label: 'Hindi' },
]

const Explore = () => {
	const { mediaType } = useParams()
	const title = `Explore ${mediaType === 'tv' ? 'TV Shows' : 'Movies'}`
	const [data, setData] = useState(null)
	const [pageNum, setPageNum] = useState(1)
	const [loading, setLoading] = useState(false)
	const [genres, setGenres] = useState([])
	const [sortby, setSortby] = useState(null)
	const [language, setLanguage] = useState(null)
	const [year, setYear] = useState('')
	const [minRating, setMinRating] = useState('')
	const [releaseType, setReleaseType] = useState('')
	const { data: genresData } = useFetch(`/genre/${mediaType}/list`)

	const filters = {
		...(sortby && { sort_by: sortby.value }),
		...(genres.length && { with_genres: genres.map((genre) => genre.id).join(',') }),
		...(language && { with_original_language: language.value }),
		...(year && mediaType === 'tv' && { first_air_date_year: year }),
		...(year && mediaType === 'movie' && { primary_release_year: year }),
		...(minRating && { 'vote_average.gte': minRating, 'vote_count.gte': 50 }),
		...(releaseType && mediaType === 'movie' && { with_release_type: releaseType }),
	}

	const fetchPage = useCallback(async (page, append = false) => {
		setLoading(true)
		const result = await fetchDataApi(`/discover/${mediaType}`, {
			params: { ...filters, page },
		})
		if (result) {
			setData((current) => append && current
				? { ...result, results: [...current.results, ...result.results] }
				: result)
			setPageNum(page + 1)
		}
		setLoading(false)
	}, [mediaType, sortby, genres, language, year, minRating, releaseType])

	useEffect(() => {
		setData(null)
		setPageNum(1)
		fetchPage(1)
	}, [fetchPage])

	const updateFilters = (setValue) => (value) => {
		setValue(value)
		setData(null)
		setPageNum(1)
	}

	return (
		<div>
			<Helmet><title>{title}</title><meta name="description" content="Explore and filter movies and TV shows" /></Helmet>
			<div className="explorePage">
				<ContentWrapper>
					<div className="pageHeader">
						<div className="pageTitle">{title}</div>
						<div className="filters">
							<Select isMulti name="genres" value={genres} closeMenuOnSelect={false} options={genresData?.genres || []} getOptionLabel={(option) => option.name} getOptionValue={(option) => option.id} onChange={updateFilters(setGenres)} placeholder="Genres" className="react-select-container genresDD" classNamePrefix="react-select" />
							<Select name="sortby" value={sortby} options={sortbyData} onChange={updateFilters(setSortby)} isClearable placeholder="Sort by" className="react-select-container sortbyDD" classNamePrefix="react-select" />
							<Select name="language" value={language} options={languageOptions} onChange={updateFilters(setLanguage)} isClearable placeholder="Language" className="react-select-container extraFilter" classNamePrefix="react-select" />
							<label className="numberFilter">Year<input type="number" min="1900" max="2100" placeholder="Any" value={year} onChange={(event) => updateFilters(setYear)(event.target.value)} /></label>
							<label className="numberFilter">Min rating<input type="number" min="0" max="10" step="0.5" placeholder="0" value={minRating} onChange={(event) => updateFilters(setMinRating)(event.target.value)} /></label>
							{mediaType === 'movie' && <label className="releaseFilter">Release type<select value={releaseType} onChange={(event) => updateFilters(setReleaseType)(event.target.value)}><option value="">Any</option><option value="2|3">Theatrical</option><option value="4">Digital</option><option value="5">Physical</option><option value="6">TV</option></select></label>}
						</div>
					</div>
					{loading && !data && <Spinner initial={true} />}
					{data?.results?.length > 0 ? (
						<InfiniteScroll className="content" dataLength={data.results.length} next={() => fetchPage(pageNum, true)} hasMore={pageNum <= data.total_pages} loader={<Spinner />}>
							{data.results.map((item) => <MovieCard key={item.id} data={item} mediaType={mediaType} />)}
						</InfiniteScroll>
					) : data && !loading ? <span className="resultNotFound">Sorry, Results not found!</span> : null}
				</ContentWrapper>
			</div>
		</div>
	)
}

export default Explore

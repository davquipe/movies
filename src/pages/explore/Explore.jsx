import { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BsCalendar3, BsCreditCard, BsFilm, BsGift, BsGlobe, BsMegaphone, BsPlayCircle, BsSortAlphaDown, BsSortDown, BsStar, BsTags, BsTranslate, BsTv } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import AppSelect from '../../components/appSelect/AppSelect'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import MovieCard from '../../components/movieCard/MovieCard'
import Spinner from '../../components/spinner/Spinner'
import useFetch from '../../hooks/useFetch'
import { fetchDataApi } from '../../utils/api'
import './Explore.scss'

const regions = [
	{ value: 'PE', label: 'Peru', flagEmoji: '🇵🇪', showIconInValue: true }, { value: 'US', label: 'United States', flagEmoji: '🇺🇸', showIconInValue: true },
	{ value: 'MX', label: 'Mexico', flagEmoji: '🇲🇽', showIconInValue: true }, { value: 'AR', label: 'Argentina', flagEmoji: '🇦🇷', showIconInValue: true },
	{ value: 'CL', label: 'Chile', flagEmoji: '🇨🇱', showIconInValue: true }, { value: 'CO', label: 'Colombia', flagEmoji: '🇨🇴', showIconInValue: true },
	{ value: 'ES', label: 'Spain', flagEmoji: '🇪🇸', showIconInValue: true }, { value: 'BR', label: 'Brazil', flagEmoji: '🇧🇷', showIconInValue: true },
]

const sortOptions = [
	{ value: 'popularity.desc', label: 'Popularity: high to low' },
	{ value: 'popularity.asc', label: 'Popularity: low to high' },
	{ value: 'vote_average.desc', label: 'Rating: high to low' },
	{ value: 'vote_average.asc', label: 'Rating: low to high' },
	{ value: 'primary_release_date.desc', label: 'Release: newest first' },
	{ value: 'primary_release_date.asc', label: 'Release: oldest first' },
	{ value: 'original_title.asc', label: 'Title (A–Z)' },
]

const languages = [
	{ value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' },
	{ value: 'fr', label: 'French' }, { value: 'ja', label: 'Japanese' },
	{ value: 'ko', label: 'Korean' }, { value: 'hi', label: 'Hindi' },
]

const monetizationOptions = [
	{ value: 'flatrate', label: 'Subscription' },
	{ value: 'free', label: 'Free' },
	{ value: 'ads', label: 'With ads' },
	{ value: 'rent', label: 'Rent' },
	{ value: 'buy', label: 'Buy' },
]

const releaseTypeOptions = [
	{ value: '', label: 'Any release' }, { value: '2|3', label: 'Theatrical' },
	{ value: '4', label: 'Digital' }, { value: '5', label: 'Physical' }, { value: '6', label: 'TV' },
]

// eslint-disable-next-line react/display-name
const optionFormatter = (Icon, getLabel = (option) => option.label, getImage) => (option, { context }) => (
	<span className="appSelect__option">
		{(context === 'menu' || option.showIconInValue) && (option.flagEmoji ? <span className="appSelect__flag" aria-hidden="true">{option.flagEmoji}</span> : getImage?.(option) ? <img src={getImage(option)} alt="" /> : <Icon aria-hidden="true" />)}
		<span>{getLabel(option)}</span>
	</span>
)

const sortOptionFormatter = (option, { context }) => {
	const Icon = option.value.startsWith('vote_average') ? BsStar : option.value.includes('release') ? BsCalendar3 : option.value.startsWith('original_title') ? BsSortAlphaDown : BsSortDown
	return <span className="appSelect__option">{context === 'menu' && <Icon aria-hidden="true" />}<span>{option.label}</span></span>
}

const monetizationOptionFormatter = (option, { context }) => {
	const Icon = option.value === 'ads' ? BsMegaphone : option.value === 'free' ? BsGift : option.value === 'flatrate' ? BsPlayCircle : BsCreditCard
	return <span className="appSelect__option">{context === 'menu' && <Icon aria-hidden="true" />}<span>{option.label}</span></span>
}

const Explore = () => {
	const { mediaType } = useParams()
	const title = `Explore ${mediaType === 'tv' ? 'TV Shows' : 'Movies'}`
	const [data, setData] = useState(null)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [genres, setGenres] = useState([])
	const [sort, setSort] = useState(null)
	const [language, setLanguage] = useState(null)
	const [year, setYear] = useState('')
	const [rating, setRating] = useState('')
	const [releaseType, setReleaseType] = useState('')
	const [certification, setCertification] = useState('')
	const [certificationsByRegion, setCertificationsByRegion] = useState({})
	const [region, setRegion] = useState(() => {
		const storedRegion = localStorage.getItem('movies-region')
		return regions.some((item) => item.value === storedRegion) ? storedRegion : 'PE'
	})
	const [provider, setProvider] = useState(null)
	const [monetization, setMonetization] = useState(null)
	const [providerOptions, setProviderOptions] = useState([])
	const [providersLoading, setProvidersLoading] = useState(false)
	const { data: genresData } = useFetch(`/genre/${mediaType}/list`)
	const regionOption = regions.find((item) => item.value === region) || regions[0]
	const certificationOptions = certificationsByRegion[region] || []
	const certificationSelectOptions = certificationOptions.filter((item) => item.certification).map((item) => ({
		value: item.certification,
		label: item.meaning ? `${item.certification} · ${item.meaning}` : item.certification,
	}))

	useEffect(() => {
		let active = true
		fetchDataApi('/certification/movie/list')
			.then((response) => {
				if (active && response?.certifications) setCertificationsByRegion(response.certifications)
			})
		return () => { active = false }
	}, [])

	useEffect(() => {
		let active = true
		setProvider(null)
		setProviderOptions([])
		setProvidersLoading(true)
		fetchDataApi(`/watch/providers/${mediaType}`, { params: { watch_region: region, language: 'en-US' } })
			.then((response) => {
				if (active) setProviderOptions(response?.results || [])
			})
			.finally(() => { if (active) setProvidersLoading(false) })
		return () => { active = false }
	}, [mediaType, region])

	const filters = useMemo(() => ({
		...(sort && { sort_by: sort.value }),
		...(genres.length && { with_genres: genres.map((genre) => genre.id).join(',') }),
		...(language && { with_original_language: language.value }),
		...(year && mediaType === 'tv' && { first_air_date_year: year }),
		...(year && mediaType === 'movie' && { primary_release_year: year }),
		...(rating && { 'vote_average.gte': rating, 'vote_count.gte': 50 }),
		...(releaseType && mediaType === 'movie' && { with_release_type: releaseType }),
		...(certification && mediaType === 'movie' && { certification_country: region, 'certification.lte': certification }),
		...((provider || monetization) && { watch_region: region }),
		...(provider && { with_watch_providers: provider.provider_id }),
		...(monetization && { with_watch_monetization_types: monetization.value }),
	}), [sort, genres, language, year, mediaType, rating, releaseType, certification, provider, region, monetization])

	const fetchPage = useCallback(async (requestedPage, append = false) => {
		setLoading(true)
		const result = await fetchDataApi(`/discover/${mediaType}`, { params: { ...filters, page: requestedPage } })
		if (result) {
			setData((current) => append && current
				? { ...result, results: [...current.results, ...result.results] }
				: result)
			setPage(requestedPage + 1)
		}
		setLoading(false)
	}, [mediaType, filters])

	useEffect(() => {
		setData(null)
		setPage(1)
		fetchPage(1)
	}, [fetchPage])

	const clearProviderFilters = () => {
		setProvider(null)
		setMonetization(null)
	}

	const handleRegionChange = (option) => {
		if (!option) return
		setRegion(option.value)
		setCertification('')
		localStorage.setItem('movies-region', option.value)
	}

	const selectClass = (extra = '') => `explorePage__select ${extra}`.trim()

	return (
		<main className="explorePage">
			<Helmet><title>{title}</title><meta name="description" content="Explore movies and shows by genre, rating and streaming service" /></Helmet>
			<ContentWrapper>
				<header className="explorePage__header">
					<div className="explorePage__heading">
						<h1 className="explorePage__title">{title}</h1>
						<p className="explorePage__subtitle">Find your next favorite.</p>
					</div>
					<div className="explorePage__filters" aria-label="Catalog filters">
						<div className="explorePage__filterRow explorePage__filterRow--primary">
							<div className="explorePage__filterGroup explorePage__filterGroup--genres"><span className="explorePage__filterLabel">Genre</span><AppSelect isMulti name="genres" icon={BsTags} formatOptionLabel={optionFormatter(BsTags, (option) => option.name)} value={genres} closeMenuOnSelect={false} options={genresData?.genres || []} getOptionLabel={(option) => option.name} getOptionValue={(option) => option.id} onChange={(value) => setGenres(value || [])} placeholder="All genres" className={selectClass('explorePage__select--genres')}  /></div>
							<div className="explorePage__filterGroup"><span className="explorePage__filterLabel">Sort</span><AppSelect name="sort" icon={BsSortDown} formatOptionLabel={sortOptionFormatter} value={sort} options={sortOptions} onChange={setSort} isClearable placeholder="Popularity" className={selectClass('explorePage__select--sort')}  /></div>
							<div className="explorePage__filterGroup"><span className="explorePage__filterLabel">Language</span><AppSelect name="language" icon={BsTranslate} formatOptionLabel={optionFormatter(BsTranslate)} value={language} options={languages} onChange={setLanguage} isClearable placeholder="All languages" className={selectClass('explorePage__select--language')}  /></div>
						</div>
						<div className="explorePage__filterRow explorePage__filterRow--secondary">
							<label className="explorePage__field"><span className="explorePage__filterLabel">Year</span><input type="number" min="1900" max="2100" placeholder="Any year" value={year} onChange={(event) => setYear(event.target.value)} /></label>
							<label className="explorePage__field"><span className="explorePage__filterLabel">Minimum rating</span><input type="number" min="0" max="10" step="0.5" placeholder="Any rating" value={rating} onChange={(event) => setRating(event.target.value)} /></label>
							{mediaType === 'movie' && <div className="explorePage__field"><span className="explorePage__filterLabel">Release type</span><AppSelect name="releaseType" icon={BsFilm} formatOptionLabel={optionFormatter(BsFilm)} value={releaseTypeOptions.find((item) => item.value === releaseType)} options={releaseTypeOptions} onChange={(option) => setReleaseType(option?.value || '')} isSearchable={false} className={selectClass('explorePage__select--field')}  /></div>}
							{mediaType === 'movie' && certificationOptions.length > 0 && <div className="explorePage__field"><span className="explorePage__filterLabel">Age rating · {regionOption.label}</span><AppSelect name="certification" icon={BsStar} formatOptionLabel={optionFormatter(BsStar, (option) => option.label)} value={certificationSelectOptions.find((item) => item.value === certification) || null} options={certificationSelectOptions} onChange={(option) => setCertification(option?.value || '')} isClearable placeholder="Any rating" className={selectClass('explorePage__select--field')}  /></div>}
						</div>
					</div>
				</header>

				<section className="explorePage__streaming" aria-labelledby="streaming-title">
					<div className="explorePage__streamingIntro">
						<div>
							<h2 className="explorePage__streamingTitle" id="streaming-title">Browse by streaming service</h2>
							<p className="explorePage__streamingDescription">See what&apos;s available where you watch.</p>
						</div>
					</div>
					<div className="explorePage__providerControls">
						<label className="explorePage__providerSelect"><span className="explorePage__controlLabel">Region</span><AppSelect name="region" icon={BsGlobe} formatOptionLabel={optionFormatter(BsGlobe)} value={regionOption} options={regions} onChange={handleRegionChange} className="explorePage__select explorePage__select--region"  isSearchable={false} /></label>
						<div className="explorePage__providerSelect"><span className="explorePage__controlLabel">Streaming service</span><AppSelect name="provider" icon={BsTv} formatOptionLabel={optionFormatter(BsTv, (option) => option.provider_name, (option) => option.logo_path ? `https://image.tmdb.org/t/p/w92${option.logo_path}` : null)} value={provider} options={providerOptions} getOptionLabel={(option) => option.provider_name} getOptionValue={(option) => option.provider_id} onChange={setProvider} isClearable placeholder={providersLoading ? 'Loading services…' : providerOptions.length ? 'All services' : 'No services listed'} isDisabled={providersLoading || !providerOptions.length} className="explorePage__select explorePage__select--provider"  /></div>
						<div className="explorePage__providerSelect"><span className="explorePage__controlLabel">Availability</span><AppSelect name="monetization" icon={BsPlayCircle} formatOptionLabel={monetizationOptionFormatter} value={monetization} options={monetizationOptions} onChange={setMonetization} isClearable placeholder="Any availability" className="explorePage__select explorePage__select--availability"  /></div>
						{(provider || monetization) && <button className="explorePage__clear" type="button" onClick={clearProviderFilters}>Clear service filters</button>}
					</div>
					{providerOptions.length > 0 && <div className="explorePage__providerRail" aria-label="Popular streaming services">
						{providerOptions.slice(0, 12).map((item) => <button className={`explorePage__providerChip ${provider?.provider_id === item.provider_id ? 'explorePage__providerChip--active' : ''}`} key={item.provider_id} type="button" onClick={() => setProvider(provider?.provider_id === item.provider_id ? null : item)} aria-pressed={provider?.provider_id === item.provider_id} title={`Filter by ${item.provider_name}`}><img src={`https://image.tmdb.org/t/p/w92${item.logo_path}`} alt="" loading="lazy" /><span>{item.provider_name}</span></button>)}
					</div>}
				</section>

				{provider && <p className="explorePage__activeFilter">Showing titles on <strong>{provider.provider_name}</strong> in {regionOption.label}</p>}
				{loading && !data && <Spinner initial={true} />}
				{data?.results?.length > 0 ? <InfiniteScroll className="content explorePage__results" dataLength={data.results.length} next={() => fetchPage(page, true)} hasMore={page <= data.total_pages} loader={<Spinner />}>
					{data.results.map((item) => <MovieCard key={item.id} data={item} mediaType={mediaType} />)}
				</InfiniteScroll> : data && !loading ? <p className="explorePage__empty">No titles found with these filters. Try another service or clear a filter.</p> : null}
			</ContentWrapper>
		</main>
	)
}

export default Explore

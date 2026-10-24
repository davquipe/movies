import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { BsGlobe, BsTags, BsTv } from 'react-icons/bs'
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'
import AppSelect from '../../../components/appSelect/AppSelect'
import Carousel from '../../../components/carousel/Carousel'
import useFetch from '../../../hooks/useFetch'
import './Trending.scss'

const mediaOptions = [
	{ id: 'movie', label: 'Movies' }, { id: 'tv', label: 'TV shows' }, { id: 'person', label: 'People' },
]

const Trending = () => {
	const [mediaType, setMediaType] = useState('movie')
	const [timeWindow, setTimeWindow] = useState('day')
	const [genre, setGenre] = useState('')
	const [country, setCountry] = useState('')
	const [provider, setProvider] = useState('')
	const peopleRail = useRef(null)
	const people = mediaType === 'person'
	const catalogType = mediaType === 'tv' ? 'tv' : 'movie'
	const { data: genresData } = useFetch(`/genre/${catalogType}/list`)
	const { data: countriesData } = useFetch('/configuration/countries')
	const { data: providersData } = useFetch(`/watch/providers/${catalogType}?watch_region=${country || 'US'}&language=en-US`)
	const hasFilters = !people && Boolean(genre || country || provider)
	const requestUrl = useMemo(() => {
		if (!hasFilters) return `/trending/${mediaType}/${timeWindow}`
		const params = new URLSearchParams({ sort_by: 'popularity.desc', page: '1' })
		if (genre) params.set('with_genres', genre)
		if (country) {
			if (mediaType === 'movie') params.set('region', country)
			else params.set('with_origin_country', country)
		}
		if (provider && country) {
			params.set('with_watch_providers', provider)
			params.set('watch_region', country)
		}
		return `/discover/${mediaType}?${params.toString()}`
	}, [hasFilters, mediaType, timeWindow, genre, country, provider])
	const { data, loading } = useFetch(requestUrl)
	const countries = (countriesData || []).filter((item) => item.iso_3166_1 && item.english_name).sort((a, b) => a.english_name.localeCompare(b.english_name))
	const providers = providersData?.results || []

	useEffect(() => {
		peopleRail.current?.scrollTo({ left: 0 })
	}, [mediaType, timeWindow, requestUrl])

	useEffect(() => {
		setGenre('')
		setCountry('')
		setProvider('')
	}, [mediaType])

	const navigatePeople = (direction) => {
		const rail = peopleRail.current
		if (rail) rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: 'smooth' })
	}

	return (
		<section className="trendingSection">
			<ContentWrapper>
				<div className="trendingSection__header">
					<div><p className="trendingSection__eyebrow">What everyone is watching</p><h2 className="trendingSection__title">Trending</h2></div>
					<div className="trendingSection__controls">
						<div className="trendingSection__tabs" role="tablist" aria-label="Trending category">
							{mediaOptions.map((option) => <button key={option.id} type="button" role="tab" aria-selected={mediaType === option.id} className={`trendingSection__tab ${mediaType === option.id ? 'trendingSection__tab--active' : ''}`} onClick={() => setMediaType(option.id)}>{option.label}</button>)}
						</div>
						{!hasFilters && <div className="trendingSection__tabs trendingSection__tabs--period" role="group" aria-label="Trending period">{['day', 'week'].map((period) => <button key={period} type="button" aria-pressed={timeWindow === period} className={`trendingSection__tab ${timeWindow === period ? 'trendingSection__tab--active' : ''}`} onClick={() => setTimeWindow(period)}>{period === 'day' ? 'Today' : 'This week'}</button>)}</div>}
					</div>
				</div>
				{!people && <div className="trendingSection__filters" aria-label="Filter trending titles">
					<label><span>Genre</span><AppSelect aria-label="Genre" icon={BsTags} options={(genresData?.genres || []).map((item) => ({ value: String(item.id), label: item.name, icon: BsTags }))} value={genre ? { value: genre, label: genresData?.genres?.find((item) => String(item.id) === genre)?.name } : null} onChange={(option) => setGenre(option?.value || '')} placeholder="All genres" isClearable /></label>
					<label><span>Country</span><AppSelect aria-label="Country" icon={BsGlobe} options={countries.map((item) => ({ value: item.iso_3166_1, label: item.english_name, icon: BsGlobe }))} value={country ? { value: country, label: countries.find((item) => item.iso_3166_1 === country)?.english_name } : null} onChange={(option) => { setCountry(option?.value || ''); setProvider('') }} placeholder="Any country" isClearable /></label>
					<label><span>Streaming service</span><AppSelect aria-label="Streaming service" icon={BsTv} options={providers.map((item) => ({ value: String(item.provider_id), label: item.provider_name, image: item.logo_path ? `https://image.tmdb.org/t/p/w92${item.logo_path}` : null }))} value={provider ? { value: provider, label: providers.find((item) => String(item.provider_id) === provider)?.provider_name } : null} onChange={(option) => setProvider(option?.value || '')} placeholder="All services" isClearable isDisabled={!country} /></label>
					{hasFilters && <button type="button" className="trendingSection__clear" onClick={() => { setGenre(''); setCountry(''); setProvider('') }}>Clear filters</button>}
				</div>}
			</ContentWrapper>
			{people ? <div className="trendingPeopleSlider">
				<button className="trendingPeopleSlider__arrow trendingPeopleSlider__arrow--left" type="button" onClick={() => navigatePeople(-1)} aria-label="Previous trending people"><BsChevronLeft /></button>
				<div className="trendingPeople" aria-label="Trending people" ref={peopleRail}>
					{loading ? Array.from({ length: 6 }, (_, index) => <div className="trendingPeople__skeleton" key={index} />) : data?.results?.map((person) => <Link className="trendingPeople__card" to={`/person/${person.id}`} key={person.id}><div className="trendingPeople__portrait">{person.profile_path ? <img src={`https://image.tmdb.org/t/p/w342${person.profile_path}`} alt="" loading="lazy" /> : <span>{person.name?.charAt(0)}</span>}</div><strong>{person.name}</strong><span>{person.known_for_department || 'Popular person'}</span></Link>)}
				</div>
				<button className="trendingPeopleSlider__arrow trendingPeopleSlider__arrow--right" type="button" onClick={() => navigatePeople(1)} aria-label="Next trending people"><BsChevronRight /></button>
			</div> : <Carousel data={data?.results} loading={loading} endpoint={mediaType} />}
		</section>
	)
}

export default Trending

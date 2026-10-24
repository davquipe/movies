import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import AppSelect from '../../components/appSelect/AppSelect'
import { BsBriefcase, BsCalendar3, BsSortDown, BsStar } from 'react-icons/bs'
import MovieCard from '../../components/movieCard/MovieCard'
import Spinner from '../../components/spinner/Spinner'
import useFetch from '../../hooks/useFetch'
import avatar from '../../assets/images/avatar.png'
import './Person.scss'

const Person = () => {
	const { id } = useParams()
	const [creditType, setCreditType] = useState('all')
	const [department, setDepartment] = useState('All departments')
	const [sortBy, setSortBy] = useState('popularity')
	const { data, loading, error } = useFetch(`/person/${id}`)
	const { data: credits, loading: creditsLoading } = useFetch(`/person/${id}/combined_credits`)
	const knownFor = useMemo(() => {
		const entries = [...(credits?.cast || []), ...(credits?.crew || [])]
		const unique = new Map()
		entries.forEach((item) => {
			const creditKind = item.character ? 'cast' : item.department || 'crew'
			const key = `${item.media_type}-${item.id}-${creditKind}`
			if (item.id && item.poster_path && item.media_type && !unique.has(key)) {
				unique.set(key, item)
			}
		})
		return [...unique.values()].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
	}, [credits])
	const departments = useMemo(() => ['All departments', ...new Set(knownFor.filter((item) => !item.character).map((item) => item.department).filter(Boolean))], [knownFor])
	const visibleCredits = useMemo(() => {
		const filtered = knownFor.filter((item) => {
			if (creditType === 'cast' && !item.character) return false
			if (creditType === 'crew' && item.character) return false
			if (creditType === 'crew' && department !== 'All departments' && item.department !== department) return false
			return true
		})
		return filtered.sort((a, b) => {
			if (sortBy === 'rating') return (b.vote_average || 0) - (a.vote_average || 0)
			if (sortBy === 'newest') return (b.release_date || b.first_air_date || '').localeCompare(a.release_date || a.first_air_date || '')
			return (b.popularity || 0) - (a.popularity || 0)
		})
	}, [knownFor, creditType, department, sortBy])
	const portrait = data?.profile_path
		? `https://image.tmdb.org/t/p/w500${data.profile_path}`
		: avatar
	const roles = [data?.known_for_department, data?.place_of_birth, data?.birthday && `Born ${data.birthday}`].filter(Boolean)

	if (loading) return <main className="personPage personPage--loading"><Spinner initial /></main>
	if (error || !data) return <main className="personPage"><ContentWrapper><p className="personPage__message">We couldn&apos;t load this profile. Please try again.</p></ContentWrapper></main>

	return (
		<main className="personPage">
			<Helmet><title>{data.name} | Movies</title><meta name="description" content={`Filmography and biography of ${data.name}`} /></Helmet>
			<section className="personPage__hero">
				<ContentWrapper>
					<div className="personPage__profile">
						<div className="personPage__portrait"><img src={portrait} alt={data.name} /></div>
						<div className="personPage__intro">
							<p className="personPage__eyebrow">{data.known_for_department || 'Artist'}</p>
							<h1 className="personPage__name">{data.name}</h1>
							<div className="personPage__meta">{roles.map((role) => <span key={role}>{role}</span>)}</div>
							{data.biography && <div className="personPage__biography"><h2>Biography</h2><p>{data.biography}</p></div>}
						</div>
					</div>
				</ContentWrapper>
			</section>
			<section className="personPage__filmography">
				<ContentWrapper>
					<div className="personPage__sectionHeader"><div><p className="personPage__eyebrow">Filmography</p><h2>Credits</h2></div><span>{visibleCredits.length} titles</span></div>
					<div className="personPage__filters" aria-label="Filter filmography">
						<div className="personPage__creditTabs" role="tablist" aria-label="Credit type">{[{ id: 'all', label: 'All credits' }, { id: 'cast', label: 'Acting' }, { id: 'crew', label: 'Crew' }].map((tab) => <button type="button" role="tab" aria-selected={creditType === tab.id} className={creditType === tab.id ? 'personPage__creditTab personPage__creditTab--active' : 'personPage__creditTab'} key={tab.id} onClick={() => { setCreditType(tab.id); setDepartment('All departments') }}>{tab.label}</button>)}</div>
						{creditType === 'crew' && departments.length > 1 && <label><span>Department</span><AppSelect aria-label="Department" icon={BsBriefcase} options={departments.map((item) => ({ value: item, label: item, icon: BsBriefcase }))} value={{ value: department, label: department }} onChange={(option) => setDepartment(option?.value || 'All departments')} /></label>}
						<label><span>Sort by</span><AppSelect aria-label="Sort credits" icon={BsSortDown} options={[{ value: 'popularity', label: 'Popularity', icon: BsSortDown }, { value: 'newest', label: 'Newest', icon: BsCalendar3 }, { value: 'rating', label: 'Top rated', icon: BsStar }]} value={{ value: sortBy, label: sortBy === 'newest' ? 'Newest' : sortBy === 'rating' ? 'Top rated' : 'Popularity' }} onChange={(option) => setSortBy(option?.value || 'popularity')} /></label>
					</div>
					{creditsLoading ? <Spinner /> : visibleCredits.length ? <div className="personPage__grid">{visibleCredits.map((item, index) => <MovieCard key={`${item.media_type}-${item.id}-${item.character ? 'cast' : item.department || 'crew'}-${index}`} data={item} mediaType={item.media_type} />)}</div> : <p className="personPage__message">No credits match these filters.</p>}
				</ContentWrapper>
			</section>
		</main>
	)
}

export default Person

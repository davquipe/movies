import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import MovieCard from '../../components/movieCard/MovieCard'
import Spinner from '../../components/spinner/Spinner'
import useFetch from '../../hooks/useFetch'
import avatar from '../../assets/images/avatar.png'
import './Person.scss'

const Person = () => {
	const { id } = useParams()
	const { data, loading, error } = useFetch(`/person/${id}`)
	const { data: credits, loading: creditsLoading } = useFetch(`/person/${id}/combined_credits`)
	const knownFor = useMemo(() => {
		const entries = [...(credits?.cast || []), ...(credits?.crew || [])]
		const unique = new Map()
		entries.forEach((item) => {
			if (item.id && item.poster_path && item.media_type && !unique.has(`${item.media_type}-${item.id}`)) {
				unique.set(`${item.media_type}-${item.id}`, item)
			}
		})
		return [...unique.values()].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
	}, [credits])
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
					<div className="personPage__sectionHeader"><div><p className="personPage__eyebrow">On screen</p><h2>Known for</h2></div><span>{knownFor.length} titles</span></div>
					{creditsLoading ? <Spinner /> : knownFor.length ? <div className="personPage__grid">{knownFor.map((item) => <MovieCard key={`${item.media_type}-${item.id}`} data={item} mediaType={item.media_type} />)}</div> : <p className="personPage__message">No filmography is available yet.</p>}
				</ContentWrapper>
			</section>
		</main>
	)
}

export default Person

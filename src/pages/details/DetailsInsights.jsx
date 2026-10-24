/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react'
import { BsArrowUpRight, BsStarFill } from 'react-icons/bs'
import { BsGlobe } from 'react-icons/bs'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import AppSelect from '../../components/appSelect/AppSelect'
import useFetch from '../../hooks/useFetch'
import './DetailsInsights.scss'

const regions = [
	{ code: 'PE', name: 'Peru' }, { code: 'US', name: 'United States' }, { code: 'MX', name: 'Mexico' },
	{ code: 'AR', name: 'Argentina' }, { code: 'CL', name: 'Chile' }, { code: 'CO', name: 'Colombia' },
	{ code: 'ES', name: 'Spain' }, { code: 'BR', name: 'Brazil' },
]

const regionFlags = { PE: '🇵🇪', US: '🇺🇸', MX: '🇲🇽', AR: '🇦🇷', CL: '🇨🇱', CO: '🇨🇴', ES: '🇪🇸', BR: '🇧🇷' }
const withFlag = (region) => ({ value: region.code, label: region.name, flagEmoji: regionFlags[region.code], showIconInValue: true })

const getAvatarUrl = (path) => {
	if (!path) return null
	if (path.startsWith('/https://')) return path.slice(1)
	return `https://image.tmdb.org/t/p/w185${path}`
}

const DetailsInsights = ({ mediaType, id, title }) => {
	const [region, setRegion] = useState(() => localStorage.getItem('movies-region') || 'PE')
	const { data: reviewsData } = useFetch(`/${mediaType}/${id}/reviews`)
	const { data: listsData } = useFetch(`/${mediaType}/${id}/lists`)
	const { data: externalIds } = useFetch(`/${mediaType}/${id}/external_ids`)
	const { data: alternativeData } = useFetch(`/${mediaType}/${id}/alternative_titles`)
	const { data: translationsData } = useFetch(`/${mediaType}/${id}/translations`)
	const { data: certificationData } = useFetch(mediaType === 'movie' ? `/movie/${id}/release_dates` : `/tv/${id}/content_ratings`)
	const reviews = reviewsData?.results || []
	const lists = listsData?.results || []
	const alternatives = alternativeData?.titles || alternativeData?.results || []
	const translations = translationsData?.translations || []
	const selectedRegion = regions.find((item) => item.code === region) || regions[0]
	const localizedTitle = useMemo(() => alternatives.find((item) => item.iso_3166_1 === region && (item.title || item.name)), [alternatives, region])
	const localizedCertification = useMemo(() => {
		if (mediaType === 'movie') {
			const country = certificationData?.results?.find((item) => item.iso_3166_1 === region)
			return country?.release_dates?.find((item) => item.certification)?.certification
		}
		return certificationData?.results?.find((item) => item.iso_3166_1 === region)?.rating
	}, [certificationData, mediaType, region])
	const imdbPath = mediaType === 'movie' ? 'title' : 'title'
	const externalLinks = [
		externalIds?.imdb_id && { label: 'IMDb', href: `https://www.imdb.com/${imdbPath}/${externalIds.imdb_id}/` },
		externalIds?.wikidata_id && { label: 'Wikidata', href: `https://www.wikidata.org/wiki/${externalIds.wikidata_id}` },
		externalIds?.facebook_id && { label: 'Facebook', href: `https://www.facebook.com/${externalIds.facebook_id}` },
		externalIds?.instagram_id && { label: 'Instagram', href: `https://www.instagram.com/${externalIds.instagram_id}` },
		externalIds?.twitter_id && { label: 'X', href: `https://www.x.com/${externalIds.twitter_id}` },
	].filter(Boolean)

	const updateRegion = (event) => {
		const value = event?.value || 'PE'
		setRegion(value)
		localStorage.setItem('movies-region', value)
	}

	return (
		<section className="detailsInsights">
			<ContentWrapper>
				<header className="detailsInsights__header">
					<div><p className="detailsInsights__eyebrow">More to explore</p><h2 className="detailsInsights__title">Details &amp; community</h2></div>
					<label className="detailsInsights__region"><span>Region</span><AppSelect aria-label="Region" icon={BsGlobe} options={regions.map(withFlag)} value={withFlag(selectedRegion)} onChange={updateRegion} isSearchable={false} /></label>
				</header>
				<div className="detailsInsights__grid">
					<section className="detailsInsights__panel detailsInsights__panel--local">
						<h3>Available in {selectedRegion.name}</h3>
						{localizedTitle && localizedTitle.title !== title && <p className="detailsInsights__localized"><span>Local title</span><strong>{localizedTitle.title || localizedTitle.name}</strong></p>}
						{localizedCertification && <p className="detailsInsights__certification"><span>Age rating</span><strong>{localizedCertification}</strong></p>}
						{!localizedTitle && !localizedCertification && <p className="detailsInsights__muted">No local title or age rating is listed for this region yet.</p>}
						{translations.length > 0 && <details className="detailsInsights__translations"><summary>View available translations <span>{translations.length}</span></summary><div>{translations.slice(0, 12).map((translation) => <p key={`${translation.iso_639_1}-${translation.iso_3166_1}`}><span>{translation.english_name || translation.name || translation.iso_639_1}</span><strong>{translation.data?.title || translation.data?.name || 'Title unavailable'}</strong></p>)}</div></details>}
						{externalLinks.length > 0 && <div className="detailsInsights__externalLinks" aria-label="External sources">{externalLinks.map((link) => <a href={link.href} key={link.label} target="_blank" rel="noreferrer">{link.label}<BsArrowUpRight aria-hidden="true" /></a>)}</div>}
					</section>
					<section className="detailsInsights__panel detailsInsights__panel--reviews">
						<div className="detailsInsights__panelHeading"><h3>Community reviews</h3><span>{reviewsData?.total_results || reviews.length}</span></div>
						{reviews.length ? <div className="detailsInsights__reviews">{reviews.slice(0, 3).map((review) => {
							const avatar = getAvatarUrl(review.author_details?.avatar_path)
							const rating = review.author_details?.rating
							return <article className="detailsInsights__review" key={review.id}>
								<div className="detailsInsights__reviewAuthor">{avatar ? <img src={avatar} alt="" loading="lazy" /> : <span>{review.author?.charAt(0) || 'U'}</span>}<strong>{review.author || 'TMDB member'}</strong>{rating != null && <span className="detailsInsights__reviewRating"><BsStarFill /> {rating}/10</span>}</div>
								<p>{review.content}</p>
								{review.url && <a className="detailsInsights__readMore" href={review.url} target="_blank" rel="noreferrer">Read full review <BsArrowUpRight /></a>}
							</article>
						})}</div> : <p className="detailsInsights__muted">No community reviews yet. Check back later.</p>}
					</section>
					<section className="detailsInsights__panel detailsInsights__panel--lists">
						<div className="detailsInsights__panelHeading"><h3>Community lists</h3><span>{listsData?.total_results || lists.length}</span></div>
						{lists.length ? <div className="detailsInsights__lists">{lists.slice(0, 4).map((list) => <a className="detailsInsights__list" href={`https://www.themoviedb.org/list/${list.id}`} target="_blank" rel="noreferrer" key={list.id}><span><strong>{list.name}</strong><small>{list.item_count} titles · {list.favorite_count} saves</small></span><BsArrowUpRight aria-hidden="true" /></a>)}</div> : <p className="detailsInsights__muted">This title hasn&apos;t been added to public lists yet.</p>}
					</section>
				</div>
			</ContentWrapper>
		</section>
	)
}

export default DetailsInsights

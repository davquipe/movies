// import { Helmet } from 'react-helmet-async'
import './Details.scss'
import useFetch from '../../hooks/useFetch'
import { useParams } from 'react-router-dom'
import DetailsBanner from './detailsBanner/DetailsBanner'
import Cast from './cast/Cast'
import VideosSection from './videosSection/VideoSection'
import Recommendation from './carousels/Recommendation'
import Similar from './carousels/Similar'
import WatchProviders from './WatchProviders'
import DetailsExtras from './DetailsExtras'
import TvSeasons from './TvSeasons'
import DetailsInsights from './DetailsInsights'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'

const Details = () => {
	const { mediaType, id } = useParams()
	const { data, loading } = useFetch(`/${mediaType}/${id}/videos`)

	const { data: credits, loading: creditsLoading } = useFetch(
		`/${mediaType}/${id}/credits`,
	)
	const { data: details, loading: detailsLoading } = useFetch(
		`/${mediaType}/${id}?append_to_response=images,keywords`,
	)
	const trailer = data?.results?.find((video) => video.site === 'YouTube' && video.key && video.type === 'Trailer')
		|| data?.results?.find((video) => video.site === 'YouTube' && video.key && video.type === 'Teaser')
		|| data?.results?.find((video) => video.site === 'YouTube' && video.key)

	return (
		<>
			<DetailsBanner video={trailer} crew={credits?.crew} details={details} loading={detailsLoading} />
			<ContentWrapper><div className="detailsPage__providers"><WatchProviders mediaType={mediaType} id={id} /></div></ContentWrapper>
			<DetailsExtras data={details} mediaType={mediaType} />
			{mediaType === 'tv' && <TvSeasons showId={id} seasons={details?.seasons} />}
			<DetailsInsights mediaType={mediaType} id={id} title={details?.title || details?.name} />
			<Cast data={credits?.cast} crew={credits?.crew} loading={creditsLoading} />
			<VideosSection data={data} loading={loading} />
			<Similar mediaType={mediaType} id={id} />
			<Recommendation mediaType={mediaType} id={id} />
		</>
	)
}

export default Details

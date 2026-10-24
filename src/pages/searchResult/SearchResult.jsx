import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import MovieCard from '../../components/movieCard/MovieCard'
import Spinner from '../../components/spinner/Spinner'
import { fetchDataApi } from '../../utils/api'
import PersonResultCard from './PersonResultCard'
import './SearchResult.scss'

const tabs = [
	{ id: 'all', label: 'All' },
	{ id: 'movie', label: 'Movies' },
	{ id: 'tv', label: 'TV shows' },
	{ id: 'person', label: 'People' },
]

const SearchResult = () => {
	const { query = '' } = useParams()
	const searchTerm = query
	const [data, setData] = useState({ results: [], total_pages: 0, total_results: 0 })
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('all')
	const requestId = useRef(0)

	const loadPage = useCallback(async (requestedPage, append = false) => {
		const currentRequest = ++requestId.current
		setLoading(true)
		const response = await fetchDataApi('/search/multi', {
			params: { query: searchTerm, page: requestedPage, include_adult: false },
		})
		if (currentRequest === requestId.current && response) {
			setData((current) => append
				? { ...response, results: [...current.results, ...(response.results || [])] }
				: response)
			setPage(requestedPage + 1)
		}
		if (currentRequest === requestId.current) setLoading(false)
	}, [searchTerm])

	useEffect(() => {
		setActiveTab('all')
		setPage(1)
		setData({ results: [], total_pages: 0, total_results: 0 })
		loadPage(1)
	}, [loadPage])

	const counts = useMemo(() => data.results.reduce((result, item) => {
		result[item.media_type] = (result[item.media_type] || 0) + 1
		return result
	}, {}), [data.results])
	const visibleItems = activeTab === 'all'
		? data.results
		: data.results.filter((item) => item.media_type === activeTab)
	const hasMore = page <= data.total_pages
	const title = `Search results for “${searchTerm}”`

	return (
		<main className="searchResultsPage">
			<Helmet><title>{title}</title></Helmet>
			<ContentWrapper>
				<header className="searchResultsPage__header">
					<div><p className="searchResultsPage__eyebrow">Discover something new</p><h1 className="searchResultsPage__title">Results for <span>“{searchTerm}”</span></h1></div>
					{!loading && <p className="searchResultsPage__count">{data.total_results || 0} results</p>}
				</header>
				{data.results.length > 0 && <div className="searchResultsPage__tabs" role="tablist" aria-label="Filter search results">
					{tabs.map((tab) => {
						const count = tab.id === 'all' ? data.total_results : counts[tab.id] || 0
						return <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} className={`searchResultsPage__tab ${activeTab === tab.id ? 'searchResultsPage__tab--active' : ''}`} onClick={() => setActiveTab(tab.id)}>{tab.label}<span>{count}</span></button>
					})}
				</div>}
				{loading && data.results.length === 0 ? <Spinner initial /> : visibleItems.length > 0 ? <InfiniteScroll className="searchResultsPage__content" dataLength={data.results.length} next={() => loadPage(page, true)} hasMore={hasMore} loader={<Spinner />}>
					{visibleItems.map((item) => item.media_type === 'person'
						? <PersonResultCard key={`person-${item.id}`} person={item} />
						: <MovieCard key={`${item.media_type}-${item.id}`} data={item} mediaType={item.media_type} fromSearch />)}
				</InfiniteScroll> : loading ? <Spinner /> : data.results.length === 0 ? <p className="searchResultsPage__empty">No results found. Try another title, series, or person.</p> : <div className="searchResultsPage__empty">No {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()} on this page yet.{hasMore && <button type="button" className="searchResultsPage__loadMore" onClick={() => loadPage(page, true)}>Load more results</button>}</div>}
			</ContentWrapper>
		</main>
	)
}

export default SearchResult

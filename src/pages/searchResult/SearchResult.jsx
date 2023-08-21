import { Helmet } from 'react-helmet-async'
import './SearchResult.scss'

const SearchResult = () => {
	const title = 'SearchResult 🔎'
	return (
		<div>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			SearchResult
		</div>
	)
}

export default SearchResult

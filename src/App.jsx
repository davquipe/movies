/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { fetchDataApi } from './utils/api'
import { useDispatch } from 'react-redux'
import { getApiConfiguration, getGenres } from './store/slice/homeSlice'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Details from './pages/details/Details'
import SearchResult from './pages/searchResult/SearchResult'
import Explore from './pages/explore/Explore'
import PageNotFound from './pages/404/PageNotFound'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'

function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		const fetchApiConfig = () => {
			fetchDataApi('/configuration').then((res) => {
				const url = {
					backdrop: res.images.secure_base_url + 'original',
					poster: res.images.secure_base_url + 'w500',
					profile: res.images.secure_base_url + 'w185',
				}
				dispatch(getApiConfiguration(url))
			})
		}
		fetchApiConfig()
		genresCall()
	}, [dispatch])

	const genresCall = async () => {
		let promises = []
		let endPoints = ['tv', 'movie']
		let allGenres = {}

		endPoints.forEach((url) => {
			promises.push(fetchDataApi(`/genre/${url}/list`))
		})

		const data = await Promise.all(promises)
		data.map(({ genres }) => {
			return genres.map((item) => (allGenres[item.id] = item))
		})

		dispatch(getGenres(allGenres))
	}

	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/:mediaType/:id" element={<Details />} />
				<Route path="/search/:query" element={<SearchResult />} />
				<Route path="explore/:mediaType" element={<Explore />} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	)
}

export default App

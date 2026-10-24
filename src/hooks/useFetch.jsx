import { useEffect, useState } from 'react'
import { fetchDataApi } from '../utils/api'

const useFetch = (url) => {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		let active = true
		setLoading(true)
		setData(null)
		setError(null)

		fetchDataApi(url)
			.then((res) => {
				if (!active) return
				setLoading(false)
				setData(res)
			})
			.catch((err) => {
				if (!active) return
				console.error(err)
				setLoading(false)
				setError('Something went wrong!')
			})
		return () => { active = false }
	}, [url])

	return { data, loading, error }
}

export default useFetch

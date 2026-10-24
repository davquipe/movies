import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'movies-watchlist'

const loadWatchlist = () => {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
	} catch {
		return []
	}
}

const persist = (items) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
	} catch {
		// The in-memory watchlist remains usable if browser storage is unavailable.
	}
}

const watchlistSlice = createSlice({
	name: 'watchlist',
	initialState: { items: loadWatchlist() },
	reducers: {
		toggleWatchlistItem: (state, action) => {
			const item = action.payload
			const exists = state.items.some(
				(entry) => entry.id === item.id && entry.mediaType === item.mediaType,
			)
			state.items = exists
				? state.items.filter(
						(entry) =>
							entry.id !== item.id || entry.mediaType !== item.mediaType,
					)
				: [item, ...state.items]
			persist(state.items)
		},
	},
})

export const { toggleWatchlistItem } = watchlistSlice.actions
export default watchlistSlice.reducer

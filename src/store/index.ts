import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../slices/userSlice';
import contractSlice from '../slices/contractSlice';
import searchSlice from '../slices/searchSlice';

export const store = configureStore({
	reducer: {
		user: userSlice,
		search: searchSlice,
		contract: contractSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredPaths: ['user.avatar', 'user.background'],
				ignoredActions: ['user/setAvatar', 'user/setBackground'],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

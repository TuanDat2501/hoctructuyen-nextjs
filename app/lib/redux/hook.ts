import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
// Import RootState từ store vừa tạo ở bước 1
import type { RootState, AppDispatch, AppStore } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;

// QUAN TRỌNG: Dòng này bảo rằng useAppSelector sẽ hiểu kiểu RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppStore: () => AppStore = useStore;
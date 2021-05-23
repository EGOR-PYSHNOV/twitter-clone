import { call, put, takeLatest } from 'redux-saga/effects';
import { TagsApi } from '../../../services/api/tagsApi';
import { LoadingStatus } from '../../types';
import { setTags, setTagsLoadingStatus, TagsActionsType } from './actionCreators';
import { Tag } from './contracts/state';

export function* fetchTagsRequest() {
  try {
    const items: Tag[] = yield call(TagsApi.fetchTags);
    yield put(setTags(items));
  } catch (error) {
    yield put(setTagsLoadingStatus(LoadingStatus.ERROR));
  }
}

export function* tagsSaga() {
  yield takeLatest(TagsActionsType.FETCH_TAGS, fetchTagsRequest);
}

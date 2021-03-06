import { createReducer, on } from '@ngrx/store';
import { UsersInfoResponse } from '../../core/interfaces';
import { usersActions } from '../actions';

export interface UsersState {
  user: Partial<UsersInfoResponse>;
  loaded: boolean;
  loadingUsers: boolean;
  error: any;
}

export const usersInitialState: UsersState = {
  user: null,
  loaded: false,
  loadingUsers: false,
  error: null,
};

const _usersReducer = createReducer(
  usersInitialState,
  on(usersActions.loadUser, (state) => ({ ...state, loadingUsers: true })),
  on(usersActions.unloadUser, (state) => ({ ...state, loadingUsers: true })),
  on(usersActions.loadErrorUser, (state, { payload }) => ({
    ...state,
    loaded: false,
    loadingUsers: false,
    error: payload,
  })),
  on(usersActions.setUser, (state, { user }) => ({
    ...state,
    user: { ...user },
    loaded: true,
    loadingUsers: false,
  })),
  on(usersActions.editUser, (state, { newUser }) => ({
    ...state,
    user: {
      ...state.user,
      perfil: newUser.perfil,
      usuNickname: newUser.usuNickname,
      usuCorreo: newUser.usuCorreo,
    },
    loaded: true,
    loadingUsers: false,
  })),
  on(usersActions.editError, (state) => ({
    ...state,
  })),
  on(usersActions.changeImage, (state, { image }) => ({
    ...state,
    user: {
      perfil: { avatar: image, ...state.user.perfil },
      ...state.user,
    },
  })),
  on(usersActions.deleteUser, (state) => ({
    ...state,
    user: null,
    loaded: false,
    loadingUsers: false,
  }))
);

export function usersReducer(state, action) {
  return _usersReducer(state, action);
}

import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Layout from 'components/Layout'
import Discovery from './Discovery'
import Videos from './Videos'
import Search from './Search'
import SonglistDetail from './SonglistDetail'

import useAudio from 'hooks/useAudio'
import ROUTES from 'constants/routes'
import playMusicReducer, {
  initialState,
  PlayMusicStateContext,
  PlayMusicDispatchContext,
  AudioContext
} from 'reducers/playMusic'
import logReducer, {
  initialState as logInitialState,
  LogStateContext,
  LogDispatchContext
} from 'reducers/log'

const { useReducer, useMemo } = React

const App = () => {
  const [logState, logDispath] = useReducer(logReducer, logInitialState)
  const [state, dispatch] = useReducer(playMusicReducer, initialState)
  const [audio, audioState, audioControls, audioRef] = useAudio({ src: state.musicUrl, autoPlay: true })

  const audioInfo = useMemo(() => {
    return {
      audio,
      state: audioState,
      controls: audioControls,
      ref: audioRef
    }
  }, [state.musicUrl, audio, audioState, audioControls, audioRef])

  return (
    <BrowserRouter>
      <LogDispatchContext.Provider value={logDispath}>
        <LogStateContext.Provider value={logState}>
          <PlayMusicDispatchContext.Provider value={dispatch}>
            <PlayMusicStateContext.Provider value={state}>
              <AudioContext.Provider value={audioInfo}>
                <Layout>
                  {audio}
                  <Switch>
                    <Route path={ROUTES.DISCOVERY} component={Discovery} />
                    <Route path={ROUTES.VIDEOS} component={Videos} />
                    <Route exact path={ROUTES.SEARCH} component={Search} />
                    <Route exact path={ROUTES.SONG_LIST_DETAIL} component={SonglistDetail} />
                    <Redirect from={ROUTES.ROOT} to={ROUTES.DEFAULT_ROUTE} />
                  </Switch>
                </Layout>
              </AudioContext.Provider>
            </PlayMusicStateContext.Provider>
          </PlayMusicDispatchContext.Provider>
        </LogStateContext.Provider>
      </LogDispatchContext.Provider>
    </BrowserRouter>
  )
}

export default App

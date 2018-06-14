import React, { Component } from 'react';
import './App.css';
import Title from './scripts/titleStuff/title'
import PlaylistBtn from './scripts/createplaylist/createplaylistbtn'
import Filterpl from './scripts/titleStuff/filterpl'
import Playlist from './scripts/homepage/playlist'
import { Button } from 'reactstrap';
import { fetchAPI, getToken } from './scripts/utils/api'

class App extends Component {
  state = {
    loggedOut: false,
    userData: {},
    playlists: null,
    filterString: "",
    tracklist: []
  }
  componentDidMount(){
    //checking to see if the token is in session storage. If it is not then the user must be logged out
    if (!getToken()) {
      this.setState({loggedOut: true})
    }

    //in the utils folder the fetchAPI() is just shorting the fetch call.
    fetchAPI('me')
    .then(data => this.setState({userData: {
      user: {
        name: data.display_name,
        image: data.images[0].url
      }
    }
  }))

    fetchAPI('me/playlists')
    .then(playlists => this.setState({playlists}))


  }

  render() {

    let content = <div>
                    <h1> Welcome to Party Mod! Please Sign in! </h1> <Button onClick={() => window.location = 'http://localhost:8888/login'}>Sign in</Button>
        </div>;

//if the user isn't logged out
    if (!this.state.loggedOut) {
      //and if there isn't userdata
      if (!this.state.userData.user) {
        content = <div>Loading</div>
      } else {
        //if there is userdata and loggedOut=false
        let playlistContent = <div>Loading playlists</div>
        if (this.state.playlists) {
          //looping through the playlist and adding the filter fun to it so user can search playlists
          playlistContent = this.state.playlists.items.filter(
            playlist => playlist.name.toLowerCase()
            .includes(this.state.filterString.toLowerCase())
            ).map(playlist => {
            let playlistImage;
            //just grabbing te first image to display at the start of the images array
            if (playlist.images && playlist.images.length > 0) {
              playlistImage = playlist.images[0].url
            }
            return <Playlist title={playlist.name} image={playlistImage} id={playlist.id} songs={playlist.tracks.name} key={playlist.id}/>
          })
        }
        content = <div>
          <Title name={this.state.userData.user.name}
              profileImage={this.state.userData.user.image}
              numberOfPlaylist={playlistContent}/>

          <Filterpl onTextChange={text => this.setState({filterString: text})}/>
          {playlistContent}
          <PlaylistBtn/>
        </div>;
      }
    }

    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;

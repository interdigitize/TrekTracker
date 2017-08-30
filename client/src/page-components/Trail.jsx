import React from 'react';
import axios from 'axios';
import Posts from '../components/Posts.jsx';
import Upload from '../components/Upload.jsx';
import Weather from '../components/Weather.jsx';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGallery from 'react-image-gallery';
import { galleryConversion } from '../helpers/helpers.js';


class Trail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trailId: window.location.href.split('id=')[1],
      posts: [],
      galleryposts: [],
      currentUser: null,
      trailInfo: {},
      forceRerenderForm: false,
      imgUrl: ''
    };

    //retrieve trail's posts from server/database
    this.getTrailPosts = this.getTrailPosts.bind(this);
  }

  componentDidMount() {
    this.getTrailPosts();

    //retrieve current user from server
    axios.get('/api/currentuser')
    .then((response) => {
      if (response.data) {
        this.setState({currentUser: response.data});
      }
    });

    //retrieve current trail info from server/database
    axios.get('/api/trails/' + this.state.trailId)
      .then((response) => {
        if (response) {
          this.setState({trailInfo: response.data});
          console.log('TRAIL Info', this.state.trailInfo);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTrailPosts() {
    //retrieve trail's posts from server/database
    return axios.get('/api/posts/trails/' + this.state.trailId, {params:{trailId:this.state.trailId}})
    .then((response) => {
        var galleryposts = galleryConversion(response.data);
        this.setState({
          posts: response.data,
          galleryposts: galleryposts,
          forceRerenderForm: !this.state.forceRerenderForm,
          imgUrl: galleryposts[0] ? galleryposts[0].original : 'http://i.imgur.com/f8W2uvj.png'
        });
        return true;
    });
  }

  handleImageLoad(event) {
    console.log('Image loaded ', event.target)
  }

// <Posts posts={this.state.posts} />
  render() {
    return (
      Object.keys(this.state.trailInfo).length === 0 ? (<div></div>) :
        (<div>
          <div style={{backgroundImage: 'url(' + this.state.imgUrl + ')'}} className={'trailPhoto'}>
            <Weather latitude={this.state.trailInfo.latitude} longitude={this.state.trailInfo.longitude} />
            {this.state.trailInfo ? <h1 className={'trailTitle'}>{this.state.trailInfo.name}</h1> : <span></span>}
          </div>
          <div className={'content-wrap flex-wrapper'} style={{marginTop: '100px'}}>
            <div className={'flex'}>
              <div><p><span className={'bold'}>Trail Length</span>: {this.state.trailInfo ? this.state.trailInfo.traillength : <span></span>}</p></div>
              <div><p>{this.state.trailInfo ? this.state.trailInfo.description : <span></span>}</p></div>
              <div><p><span className={'bold'}>Directions</span>: {this.state.trailInfo ? this.state.trailInfo.directions : <span></span>}</p></div>
            </div>
            <div className={'flex'}>
              {this.state.galleryposts.length === 0 ? <div/> :
                <ImageGallery className='imagegallery'
                  items={this.state.galleryposts}
                  slideInterval={2000}
                  onImageLoad={this.handleImageLoad}
                  thumbnailPosition={'bottom'}
                />
              }
              {this.state.currentUser ? <Upload key={this.state.forceRerenderForm} getTrailPosts={this.getTrailPosts}/> : <div/>}
            </div>

          </div>

        </div>)
    );
  }
}

export default Trail;

/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPost, selectNewPost } from './lib/actions';
import './css/App.css';
import Post from './components/Post';
import Arrows from './components/Arrows';
import Loading from './components/Loading';

const fetchPostIfNeeded = ({ post, onFetchPost, selectedPost, isLoading }) => {
  if (!post && !isLoading) onFetchPost(selectedPost);
};

class App extends Component {
  constructor(props) {
    super(props);
    fetchPostIfNeeded(props);
  }

  componentWillReceiveProps(nextProps) {
    fetchPostIfNeeded(nextProps);
  }

  render() {
    const { isLoading, post, selectedPost, onSelectNewPost } = this.props;
    return (
      <div className="App">
        <Arrows
          selectedPost={selectedPost}
          onSelectNewPost={onSelectNewPost}
        />
        { isLoading && <Loading /> }
        { post && !isLoading && <Post title={post.title} body={post.body} /> }
        <p>Fake Online REST API courtesy of: <a target="_blank" href="https://jsonplaceholder.typicode.com/">JSONPlaceholder</a></p>
      </div>
    );
  }
}

const mapStateToProps = ({ selectedPost, posts, requests }) => ({
  selectedPost,
  post: posts[selectedPost],
  isLoading: requests.FETCH_POST.hasPendingRequests,
});

const mapDispatchToProps = dispatch => ({
  onFetchPost: id => dispatch(fetchPost(id)),
  onSelectNewPost: id => dispatch(selectNewPost(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

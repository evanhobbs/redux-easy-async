import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fetchPost, selectNewPost } from './lib/actions';
import './App.css';
import Post from './components/Post';
import Arrows from './components/Arrows';
import Loading from './components/Loading';

class App extends Component {
  constructor (props) {
    super(props);
    this.fetchPostIfNeeded(props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchPostIfNeeded(nextProps);
  }

  fetchPostIfNeeded ({ post, fetchPost, selectedPost, isLoading }) {
    if (!post && !isLoading) fetchPost(selectedPost);
  }

  render() {
    const { isLoading, post, selectedPost, selectNewPost } = this.props;
    return (
      <div className="App">
        <Arrows
          selectedPost={selectedPost}
          onSelectNewPost={selectNewPost}
        />
        { isLoading && <Loading /> }
        { post && !isLoading && <Post title={post.title} body={post.body} /> }
        <p>Fake Online REST API courtesy of: <a target="_blank" href='https://jsonplaceholder.typicode.com/'>JSONPlaceholder</a></p>
      </div>
    );
  }
}

const mapStateToProps = ({ selectedPost, posts, requests }) => {
  return {
    selectedPost,
    post: posts[selectedPost],
    isLoading: requests['FETCH_POST'].hasPendingRequests,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchPost: id => dispatch(fetchPost(id)),
  selectNewPost: id => dispatch(selectNewPost(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React from 'react';
 
export default ({ onSelectNewPost, selectedPost }) => {
  const showPreviousButton = selectedPost > 1;
  return (
    <div>
      <div className="arrow-container">
        <h4>Current post: { selectedPost }</h4>
        <button
          className="btn btn-primary btn-lg btn-block"
          onClick={() => onSelectNewPost(selectedPost + 1)}
        >
          Show next post
          <span className="glyphicon glyphicon-chevron-right"></span>
        </button>
        {
          showPreviousButton &&
          <button
            className="btn btn-default btn-lg btn-block"
            onClick={() => onSelectNewPost(selectedPost - 1)}
          >
            <span className="glyphicon glyphicon-chevron-left"></span>
            Show previous post
          </button> 
        }
        
      </div>
    </div>
  )
}
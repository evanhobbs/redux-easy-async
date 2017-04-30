import React from 'react';

export default ({ title, body }) => (
  <div className="post">
    <div className="panel panel-primary">
      <div className="panel-heading">
        <h3 className="panel-title">Title: {title}</h3>
      </div>
      <div className="panel-body">
        {body}
      </div>
    </div>
  </div>
  );

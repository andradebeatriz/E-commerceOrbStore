import React from 'react';

const Rating = ({ value, text }) => {
  return (
    <div className="rating d-flex align-items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          <i
            className={
              value >= star
                ? 'fas fa-star'
                : value >= star - 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
      ))}
      <span className="ms-2">{text && text}</span>
    </div>
  );
};

export default Rating;

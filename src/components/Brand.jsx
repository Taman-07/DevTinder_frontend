import React from "react";

const APP_NAME = "Alumni-Bridge"; // used for screen readers

const Brand = ({ size = "text-xl sm:text-2xl" }) => (
  <span aria-label={APP_NAME} className={`logo-text inline-flex items-baseline ${size}`}>
    <span className="text-white">Alumni-</span>
    <span className="text-primary">Bridge</span>
  </span>
);

export default Brand;
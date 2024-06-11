import React, { useState } from "react";
import { Image } from 'react-native';
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";

const ProductCard = ({ product }) => {
  const [state, setState] = useState({})
  Image.getSize(product.images[0].url, (width, height) => {setState({ width, height, ar: width/height })});
  
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <div className="img">
        <img src={product.images[0].url} alt={product.name} />
        { (1.77 - state.ar <= 0.7) && (product.images[1]) ? <img src={product.images[1].url} alt={product.name} /> : ""}
      </div>
        <div className="productDetails">
          <p>{product.name}</p>
        <div>
        <Rating {...options} sx={{ fontSize: "2.2vmax" }} />
      </div>
      <span className="productCardSpan">
        {" "}
        ({product.numOfReviews} Reviews)
      </span>
      <span className="span">{`$ ${product.price}`}</span>
      </div>
    </Link>
  );
};

export default ProductCard;
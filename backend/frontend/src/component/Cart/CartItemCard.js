import React, { useState } from "react";
import "./CartItemCard.css";
import { Image } from 'react-native';
import { Link } from "react-router-dom";

const CartItemCard = ({ item, deleteCartItems }) => {
  const [state, setState] = useState({})
  Image.getSize(item.image[0].url, (width, height) => {setState({ width, height, ar: width/height })});
  
  return (
    <div className="CartItemCard">
      <div className="img">
        <img src={item.image[0].url} alt={item.name} />
        { (1.77 - state.ar <= 0.7) && (item.image[1]) ? <img src={item.image[1].url} alt={item.name} /> : ""}
      </div>
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>{`Price: ₹${item.price}`}</span>
        <p onClick={() => deleteCartItems(item.product)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
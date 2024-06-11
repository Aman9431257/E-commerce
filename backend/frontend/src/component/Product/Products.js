import React, { Fragment, useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Slider from "@mui/material/Slider";
import { useAlert } from "react-alert";
import { Typography } from "@mui/material";
import MetaData from "../layout/MetaData";

import { useLocation } from "react-router-dom";

const categories = [
  "All",
  "Fashion",
  "Shirts",
  "Footwear",
  "Tech",
  "Watches",
  "Glasses, Caps",
];

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { state } = useLocation();

  const [keyword, setKeyword] = useState((!state || state.keyword === null) ? "" : state.keyword);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("price");
  const [price, setPrice] = useState([0, 2500]);
  const [category, setCategory] = useState((!state || state.category === null) ? "" : state.category);
  const [ratings, setRatings] = useState(0);

  const {
    products,
    error,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  
  const keywordHandler = (e) => {
    document.getElementById('box').scrollTop = 0;
    setKeyword(e.target.value);
  }
  
  const sortHandler = (e) => {
    e.preventDefault();
    document.getElementById('box').scrollTop = 0;
    setCurrentPage(1);
    setSort(e.target.value);
  }
  
  const priceHandler = (event, newPrice) => {
    document.getElementById('box').scrollTop = 0;
    setCurrentPage(1);
    setPrice(newPrice);
  };

  const ratingHandler = (e, newRating) => {
    document.getElementById('box').scrollTop = 0;
    setCurrentPage(1);
    setRatings(newRating);
  }

  const categoryHandler = (c) => {
    document.getElementById('box').scrollTop = 0;
    setCurrentPage(1);
    setCategory(c);
  }

  const handelInfiniteScroll = async () => {
    let box = document.getElementById("box");
      
    try {
      if (window.innerHeight + box.scrollTop + 25 >= box.scrollHeight) {
        if (currentPage <= (Math.round(filteredProductsCount / 12 || 1))) {
           setCurrentPage(currentPage + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    let cate;
    category === "All" ? cate = "" : cate = category;

    dispatch(getProduct(keyword, currentPage, price, cate, ratings, sort));
    // eslint-disable-next-line
  }, [dispatch, keyword, price, currentPage, category, ratings, sort, alert, error]);

  return (
    <Fragment>
      <div className="products-con">
        <MetaData title="PRODUCTS -- ECOMMERCE" />

        <div className="products-con2">
          <div className="filterBox">
            <Typography>Search...</Typography>
            <div className="searchBox">
              <input type="text" className="searchInp" placeholder="search..." value={keyword} onChange={keywordHandler}/>
              <button type="submit" className="searchBtn" onClick={handleSubmit}>
                <SearchIcon sx={{ fontSize: "20px" }} />
              </button>
            </div>
            
            <Typography>Sort By...</Typography>
            <label className="custom-select">
              <select onChange={(e) => sortHandler(e)} defaultValue={sort} name="options">
			          <option value="price">Price (Lowest First)</option>
                <option value="price2">Price (Highest First)</option>
			          <option value="ratings">Rating</option>
			           <option value="createdAt">Latest</option>
              </select>
            </label>
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={2500}
            />

            <div>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={ratingHandler}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </div>

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((c) => (
                <li
                  className="category-link"
                  key={c}
                  onClick={() => categoryHandler(c)}
                >
                  {c === "Tech" ? "Technology" : c}
                </li>
              ))}
            </ul>
          </div>
          

          <div className="right-side" id="box" onScroll={handelInfiniteScroll}>
            <h2 className="productsHeading">Products</h2> 
            <div className="products-con3">
              {(!products.length && filteredProductsCount !== 0) ? (
                <Loader />
              ) : (
                filteredProductsCount === 0 ? (
                  <div className="notFound">No Products Found</div>
                ) : (
                  <div className="products">
                  {
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
                  }
                  {(products.length !== filteredProductsCount) && <Loader />}
                  
                </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Products;
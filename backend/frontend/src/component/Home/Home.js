import React, { Fragment, useState, useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getFeatured, getRandom, similarProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";

import { Link, useNavigate } from "react-router-dom";

import Fashion from "../../images/Fashion.png";
import Shirts from "../../images/Shirts.png";
import Footwear from "../../images/Footwear.png";
import Tech from "../../images/Tech.png";
import Watches from "../../images/Watches.png";
import GlassesCaps from "../../images/Glasses,Caps.png";

const categories = [
  {
    name: "Fashion",
    img: Fashion
  },
  {
    name: "Shirts",
    img: Shirts
  },
  {
    name: "Footwear",
    img: Footwear
  },
  {
    name: "Tech",
    img: Tech
  },
  {
    name: "Watches",
    img: Watches
  },
  {
    name: "Glasses, Caps",
    img: GlassesCaps
  },
];

var category;

do {
  category = categories[Math.floor(Math.random() * categories.length)].name;
} while (category === "Fashion");

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error: fError, products: fProducts } = useSelector((state) => state.featured);
  const { error: rError, products: rProducts } = useSelector((state) => state.random);
  const { error: sError, products: sProducts, productsCount } = useSelector((state) => state.similar);

  const [currentPage, setCurrentPage] = useState(1);

  const handelInfiniteScrollRandom = async () => {
    let box = document.getElementById("box1");
    try {
      if (window.innerHeight + box.scrollLeft + 1 >= box.scrollWidth) {
        dispatch(getRandom());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handelInfiniteScrollCategory = async () => {
    let box = document.getElementById("box2");
    try {
      if (window.innerHeight + box.scrollLeft + 1 >= box.scrollWidth) {
        setCurrentPage(currentPage + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const shopNow = () => {
    navigate("/products");
  }

  const learnMore = () => {
    navigate("/about");
  }

  useEffect(() => {
    dispatch(similarProduct(category, currentPage));
  }, [dispatch, currentPage])

  useEffect(() => {
    if (fError) {
      alert.error(fError);
      dispatch(clearErrors());
    }
    if (rError) {
      alert.error(rError);
      dispatch(clearErrors());
    }
    if (sError) {
      alert.error(sError);
      dispatch(clearErrors());
    }
    dispatch(getFeatured());
    dispatch(getRandom());
  }, [dispatch, fError, rError, sError, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="E-COMMERCE" />

          <div className="banner">
            <div className="left-div">
              <span className="sp">TOP SALES THIS WEEK</span>
              <div className="txt">
                Explore Amazing Fashionable Products This Season
              </div>
              <div className="btn-div">
                <button className="btn btn-1" onClick={() => shopNow()}>Shop Now</button>
                <button className="btn btn-2" onClick={() => learnMore()}>Learn More</button>
              </div>
            </div>
            <div className="right-div"></div>
          </div>

          <div className="homeHeading">Categories</div>
          <div className="categories">
            {
              categories.map((item) => (
                <Link to="/products" state={{category: item.name}} key={item.name}>
                  <div className="category">
                    <img src={item.img} alt={item.name}/>
                  </div>
                </Link>
              ))
            }
          </div>

          <div className="subheading">TOP SALES THIS WEEK</div>
          <div className="Heading">Featured Products</div>


          <div className="prods-con">
            {!fProducts.length ? (
              <Loader />
            ) : (
                <div className="prods">
                  {
                fProducts.map((product) => (
                  
                  <ProductCard key={product._id} product={product} />
                ))
                  }
                </div>
            )}
          </div>

          <div className="homeHeading">You May Also Like...</div>

          <div className="rand-scroll" id="box1" onScroll={handelInfiniteScrollRandom}>
                        {!rProducts?.length ? (
              <Loader />
            ) : (
                <div className="rand-prods">
                  {
                rProducts.map((item) => (
                  <ProductCard key={`${item.product[0]._id}${Math.random() * 100}`} product={item.product[0]} />
                ))
                  }
                  {<Loader />}
            
                </div>
            )}
          </div>

          <div className="homeHeading">{category}</div>

          <div className="cat-scroll" id="box2" onScroll={handelInfiniteScrollCategory}>
                        {!sProducts?.length ? (
              <Loader />
            ) : (
                <div className="cat-prods">
                  {
                sProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
                  }
                  {(sProducts.length !== productsCount - 2) && <Loader />}
            
                </div>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
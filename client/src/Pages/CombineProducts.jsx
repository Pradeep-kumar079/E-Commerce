import React from "react";
import "../Pages/CombineProducts.css";
import Toys from "../Pages/Toys";
import Sports from "./Sports";

const CombineProducts = () => {
  return (
    <div className="combine-products">
      <div className="products-section one">
        <div className="section-header">
          <h2>Toys</h2>
          <p>Here you can find toy products.</p>
        </div>
        <Toys />
      </div>

      <div className="products-section two">
        <div className="section-header">
          <h2>Sports</h2>
          <p>Here you can find sports products.</p>
        </div>
        <Sports />
      </div>
    </div>
  );
};

export default CombineProducts;

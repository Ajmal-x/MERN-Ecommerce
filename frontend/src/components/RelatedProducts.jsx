import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const RelatedProducts = ({ category, subCategory }) => {
  const { productId } = useParams();
  const { products } = useContext(ShopContext);

  const relatedProducts = products
    .filter((item) => {
      const itemId = item._id || item.id;

      return (
        item.category === category &&
        item.subCategory === subCategory &&
        String(itemId) !== String(productId)
      );
    })
    .slice(0, 5);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="my-24">
      <div className="mb-8 text-center">
        <Title text1="RELATED" text2="PRODUCTS" />

        <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500">
          You may also like these products from the same collection.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {relatedProducts.map((item) => {
          const itemId = item._id || item.id;

          return (
            <ProductItem
              key={itemId}
              id={itemId}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          );
        })}
      </div>
    </section>
  );
};

export default RelatedProducts;
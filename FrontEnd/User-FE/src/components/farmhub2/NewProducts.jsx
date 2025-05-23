import { getAllProducts } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../shared/Loading";
import Product from "./Product";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const NewProducts = () => {
  const axiosPrivate = useAxiosPrivate();
  const fetchProducts = async () => {
    try {
      const result = await getAllProducts(axiosPrivate);
      return result?.data?.content;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: products, isPending } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  // sắp xếp mới nhất
  const sortedProducts = products?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  // Lấy 5 sản phẩm mới nhất
  const latest5Products = sortedProducts?.slice(0, 5);

  return (
    <div className="flex flex-col gap-4 py-4 my-4 px-5 bg-[#E4EFE7] rounded-2xl w-full">
      <h1 className="font-bold text-2xl ml-2">Sản phẩm mới nhất</h1>
      {isPending ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {latest5Products?.map((product, index) => (
            <Product key={index} item={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewProducts;

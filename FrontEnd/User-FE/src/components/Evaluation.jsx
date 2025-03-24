import { useState } from "react";
import { FaStar } from "react-icons/fa";

function Evaluation() {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600 ">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg ">
        <h2 className="text-center text-xl font-bold text-gray-800">Đánh giá sản phẩm</h2>
        <p className="font-bold text-lg mt-3 text-indigo-700">Tên sản phẩm</p>

        <div className="mt-3 ">
          <span className="mr-2 text-gray-700">Đánh giá của bạn:</span>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`inline cursor-pointer transition transform hover:scale-125 ${
                i < rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(i + 1)}
              size={24}
            />
          ))}
        </div>

        <form className="mt-5 space-y-4">
          <input
            type="text"
            placeholder="Nhập họ tên của bạn"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />

          <div className="flex space-x-3">
            <input
              type="email"
              placeholder="Email"
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <textarea
            rows="4"
            placeholder="Nhập nội dung đánh giá"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          ></textarea>

          <label className="flex items-center space-x-3 border border-gray-300 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <span className="text-gray-600">📷 Đính kèm hình ảnh</span>
            <input type="file" className="hidden" />
          </label>

          <button
            className={`w-full p-3 rounded-lg text-white font-semibold transition ${
              rating === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
            }`}
            disabled={rating === 0}
          >
            Gửi đánh giá
          </button>
        </form>
      </div>
    </div>
  );
}

export default Evaluation;
